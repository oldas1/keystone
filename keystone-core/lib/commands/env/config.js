const { updateDescriptor } = require('../../descriptor')

const config = (userSession, { project, descriptors }) => {
  return Promise.all(
    descriptors.map(({ descriptor, env }) => {
      return Promise.all([
        updateDescriptor(userSession, {
          descriptorPath: descriptor.path,
          env,
          project,
          type: 'members',
          content: descriptor.content,
          name: descriptor.name,
          membersDescriptor: descriptor,
        }),
        updateDescriptor(userSession, {
          env,
          project,
          type: 'env',
          name: descriptor.name,
          membersDescriptor: descriptor,
          updateAnyway: true,
        }),
      ])
    })
  )
}

module.exports = config
