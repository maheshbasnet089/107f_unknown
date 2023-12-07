const { renderOrganizationForm, createOrganization, createForumTable } = require("../controller/organization/organizationController")
const { isAuthenticated } = require("../middleware/isAuthenticated")

const router = require("express").Router()

router.route("/organization").get(renderOrganizationForm).post(isAuthenticated, createOrganization , createForumTable)


module.exports = router