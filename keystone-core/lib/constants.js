module.exports = {
  ERROR_CODES: {
    PullWhileFilesModified: 'PullWhileFilesModified',
    InvitationFailed: 'InvitationFailed',
    ProjectNameExists: 'ProjectNameExists',
    ConfigFileExists: 'ConfigFileExists',
    FailedToFetch: 'FailedToFetch',
    PullBeforeYouPush: 'PullBeforeYouPush',
    NeedToBeAdminOrContributor: 'NeedToBeAdminOrContributor',
    NeedToBeAdmin: 'NeedToBeAdmin',
    MissingParams: 'MissingParams',
  },
  KEYSTONE_MAIL: 'http://localhost:8080',
  KEYSTONE_WEB: 'http://localhost:8000',
  INVITATIONS_STORE: 'invitations.json',
  ROLES: {
    ADMINS: 'admins',
    CONTRIBUTORS: 'contributors',
    READERS: 'readers',
  },
  PUBKEY: 'public.key',
  KEYSTONE_CONFIG_PATH: '.ksconfig',
  PROJECTS_STORE: 'projects.json',
  KEYSTONE_HIDDEN_FOLDER: '.keystone',
}