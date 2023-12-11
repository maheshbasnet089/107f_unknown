const { renderOrganizationForm, createOrganization, createQuestionsTable, createAnswersTable, renderDashboard, renderForumPage, renderQuestionForm, createQuestion, renderSingleQuestion, createQuestionImages } = require("../controller/organization/organizationController")
const { isAuthenticated } = require("../middleware/isAuthenticated")
const {multer,storage} = require('../middleware/multerConfig')
const upload = multer({storage : storage})

const router = require("express").Router()

router.route("/organization").get(renderOrganizationForm).post(isAuthenticated, createOrganization , createQuestionsTable,createQuestionImages, createAnswersTable)
router.route("/dashboard").get(isAuthenticated, renderDashboard)

router.route("/forum").get(isAuthenticated,renderForumPage)
router.route("/question").get(isAuthenticated,renderQuestionForm).post(isAuthenticated,upload.array('questionImage'),createQuestion)

router.route("/question/:id").get(isAuthenticated,renderSingleQuestion)


module.exports = router