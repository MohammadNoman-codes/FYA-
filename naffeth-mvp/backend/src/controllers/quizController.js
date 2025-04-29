const { Quiz, Question, Option } = require('../models/Quiz');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const { sequelize } = require('../config/db'); // Import sequelize for transactions if needed

// @desc    Submit answers for a quiz
// @route   POST /api/quizzes/:quizId/submit
// @access  Private (Student)
exports.submitQuiz = async (req, res, next) => {
    const { answers } = req.body; // Expecting answers in format like: [{ questionId: 1, selectedOptionId: 3 }]
    const quizId = req.params.quizId;
    const userId = req.user.id; // User ID from auth middleware

    try {
        const quiz = await Quiz.findByPk(quizId, {
            include: [{
                model: Question,
                include: [{
                    model: Option // Include options to check correctness
                }]
            }]
        });
        const user = await User.findByPk(userId); // Fetch user to update points/level

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (!answers || !Array.isArray(answers)) {
             return res.status(400).json({ success: false, message: 'Invalid answers format provided' });
        }

        let correctAnswers = 0;
        const totalQuestions = quiz.Questions.length; // Access included questions (Sequelize uses plural)

        // Evaluate answers
        quiz.Questions.forEach(question => {
            const userAnswer = answers.find(a => a.questionId === question.id); // Compare with question.id
            if (userAnswer) {
                const correctOption = question.Options.find(opt => opt.isCorrect); // Access included options
                if (correctOption && correctOption.id === userAnswer.selectedOptionId) { // Compare with option.id
                    correctAnswers++;
                }
            }
        });

        // Basic pass/fail logic
        const passed = correctAnswers === totalQuestions;
        let pointsEarned = 0;

        if (passed) {
            pointsEarned = quiz.pointsAwarded || 10;
            user.points += pointsEarned;

            // Basic Level Up Logic
            const pointsForNextLevel = (user.level * 100);
            if (user.points >= pointsForNextLevel) {
                user.level += 1;
            }
            await user.save(); // Save updated user points/level
        }

        res.status(200).json({
            success: true,
            passed: passed,
            score: `${correctAnswers}/${totalQuestions}`,
            pointsEarned: pointsEarned,
            newTotalPoints: user.points,
            newLevel: user.level
        });

    } catch (error) {
        console.error('Submit Quiz error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new quiz with questions and options
// @route   POST /api/quizzes (Requires lessonId, questions in body)
// @access  Private (Admin/Teacher)
exports.createQuiz = async (req, res, next) => {
    // Expecting body like: { lessonId: 1, pointsAwarded: 15, questions: [{ questionText: '..', options: [{ text: '..', isCorrect: true }, ...] }, ...] }
    const { lessonId, pointsAwarded, questions } = req.body;

    if (!lessonId || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ success: false, message: 'Missing lessonId or questions data' });
    }

    // Use a transaction to ensure all parts are created or none are
    const t = await sequelize.transaction();

    try {
        const lesson = await Lesson.findByPk(lessonId, { transaction: t });
        if (!lesson) {
            await t.rollback();
            return res.status(404).json({ success: false, message: `Lesson not found with id ${lessonId}` });
        }

        // Check if quiz already exists for this lesson
        const existingQuiz = await Quiz.findOne({ where: { lessonId: lessonId }, transaction: t });
        if (existingQuiz) {
             await t.rollback();
            return res.status(400).json({ success: false, message: `Quiz already exists for lesson ${lessonId}` });
        }

        // Create the Quiz
        const quiz = await Quiz.create({
            lessonId: lessonId,
            pointsAwarded: pointsAwarded || 10
        }, { transaction: t });

        // Create Questions and Options
        for (const qData of questions) {
            if (!qData.questionText || !qData.options || !Array.isArray(qData.options) || qData.options.length === 0) {
                 throw new Error('Invalid question or options format'); // This will trigger rollback
            }

            const question = await Question.create({
                quizId: quiz.id,
                questionText: qData.questionText
            }, { transaction: t });

            // Create options for the question
            const optionsData = qData.options.map(opt => ({
                questionId: question.id,
                text: opt.text,
                isCorrect: opt.isCorrect || false
            }));
            await Option.bulkCreate(optionsData, { transaction: t });
        }

        // If everything succeeded, commit the transaction
        await t.commit();

        // Fetch the created quiz with its associations to return
        const createdQuiz = await Quiz.findByPk(quiz.id, {
             include: [{ model: Question, include: [Option] }]
        });

        res.status(201).json({ success: true, data: createdQuiz });

    } catch (error) {
        // If any error occurred, rollback the transaction
        await t.rollback();
        console.error('Create Quiz error:', error);
         if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(400).json({ success: false, message: error.message || 'Error creating quiz' });
    }
};
