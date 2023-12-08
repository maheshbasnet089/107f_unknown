const { renderOrganizationForm, createOrganization, createQuestionsTable, createAnswersTable, renderDashboard, renderForumPage, renderQuestionForm, createQuestion } = require("../controller/organization/organizationController")
const { isAuthenticated } = require("../middleware/isAuthenticated")

const router = require("express").Router()

router.route("/organization").get(renderOrganizationForm).post(isAuthenticated, createOrganization , createQuestionsTable,createAnswersTable)
router.route("/dashboard").get(isAuthenticated, renderDashboard)

router.route("/forum").get(isAuthenticated,renderForumPage)
router.route("/question").get(isAuthenticated,renderQuestionForm).post(isAuthenticated,createQuestion)

module.exports = router