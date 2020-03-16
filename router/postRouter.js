const express = require('express')
const db = require('../data/db')
const router = express.Router()

//EndPoints Go Here

//POSTS ONLY ENDPOINTS
router.post('/', (req, res) => {
	const { title, contents } = req.body

	!title || !contents
		? res.status(400).json({ errorMessage: 'You Did Not Provide Title and Contents for this Post' })
		: db
				.insert(req.body)
				.then(post => {
					res.status(201).json(req.body)
				})
				.catch(err => {
					res.status(500).json({
						message: 'There was an problem saving this post',
						err,
					})
				})
})

router.get('/', (req, res) => {
	db
		.find()
		.then(post => {
			res.status(200).json(post)
		})
		.catch(err => {
			res.status(500).json({ message: 'Could Not Retrieve Posts' })
		})
})

router.get('/:id', (req, res) => {
	const id = req.params.id

	db
		.findById(id)
		.then(post => {
			post ? res.status(200).json(post) : res.status(404).json({ message: 'That Post ID Does NOT Exist' })
		})
		.catch(err => {
			res.status(500).json({ message: 'The Post Could Not Be Found' })
		})
})

router.delete('/:id', (req, res) => {
	const id = req.params.id
  db
  .findById(id)
  .then(post =>{
    post ?
      db
        .remove(id)
        .then(deleted => {
          deleted ? res.status(200).json({ message: `Post ${id} was deleted`, info: (post) }) : res.status(404).json({ message: 'That Post ID Does NOT Exist' })
        })
      : null
  })
        .catch(err => {
          res.status(500).json({ message: 'The Post Could Not Be Removed' })
        })
    
})

router.put('/:id', (req, res) => {
	const { title, contents } = req.body
	const id = req.params.id

	!title || !contents
		? res.status(400).json({ errorMessage: 'You Did Not Provide Title and Contents for this Post' })
		: db
				.update(id, req.body)
				.then(post => {
					post ? res.status(200).json(req.body) : res.status(404).json({ message: 'That Post ID Does NOT Exist' })
				})
				.catch(err => {
					res.status(500).json({
						message: 'There was a problem saving this post',
					})
				})
})



//COMMENTS ENDPOINTS (NOT WORTH MAKING ANOTHER ROUTER FOR SINCE THERE ARE ONLY 2)

router.post('/:id/comments', (req, res) => {
	const { text } = req.body
	const post_id = req.params.id

	!text
		? res.status(400).json({ errorMessage: 'Please provide text for the comment.' })
		: db.findById(post_id).then(post => {
				if (!post) {
					res.status(404).json({ message: 'The post with the specified ID does not exist.' })
				} else {
					let newComment = {
						text: text,
						post_id: post_id,
					}
					db
						.insertComment(newComment)
						.then(({ id }) => {
							db.findCommentById(id).then(comment => {
								res.status(201).json(comment)
							})
						})
						.catch(err => {
							res.status(500).json({
								message: 'There was an error while saving the comment to the database',
							})
						})
				}
		})
})


router.get('/:id/comments', (req, res) => {
  const id = req.params.id
  
	db
		.findPostComments(id)
		.then(data => {
			data ? res.status(200).json(data) : res.status(404).json({ message: 'The Post ID Does NOT Exist.' })
		})
		.catch(err => {
			res.status(500).json({
				message: 'The comments information could not be retrieved.',
			})
		})
})

module.exports = router
