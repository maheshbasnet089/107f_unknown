const { renderOrganizationForm, createOrganization, createQuestionsTable, createAnswersTable, renderDashboard, renderForumPage, renderQuestionForm, createQuestion, renderSingleQuestion, createQuestionImages, answerQuestion, renderMyOrgs, deleteOrganization, renderInvitePage, inviteFriends, acceptInvitation, deleteQuestions, deleteAnswer, logOut, fetchOrgs } = require("../controller/organization/organizationController")
const { isAuthenticated } = require("../middleware/isAuthenticated")
const {multer,storage} = require('../middleware/multerConfig')
const upload = multer({storage : storage})

const router = require("express").Router()

router.route("/organization").get(isAuthenticated, renderOrganizationForm).post(isAuthenticated, createOrganization , createQuestionsTable,createQuestionImages, createAnswersTable)
router.route("/organization/:id").get(isAuthenticated,deleteOrganization)

router.route("/dashboard").get(isAuthenticated, renderDashboard)

router.route("/forum").get(isAuthenticated,renderForumPage)
router.route("/question").get(isAuthenticated,renderQuestionForm).post(isAuthenticated,upload.array('questionImage'),createQuestion)

router.route("/question/:id").get(isAuthenticated,renderSingleQuestion)
router.route("/questiondelete/:id").get(isAuthenticated,deleteQuestions)

router.route("/answer").post(isAuthenticated,answerQuestion)

router.route("/myorgs").get(isAuthenticated,renderMyOrgs)

router.route("/invite").get(isAuthenticated,renderInvitePage).post(isAuthenticated,inviteFriends)

router.route("/accept-invite").get(isAuthenticated,acceptInvitation)

router.route("/logOut").get(isAuthenticated,logOut)
router.route("/answer/:id").get(isAuthenticated,deleteAnswer)






module.exports = router