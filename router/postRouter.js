const express = require('express')
const db = require('../data/db.js')
const router = express.Router()

//EndPoints Go Here

//Post a Post (Works on PostMan)
router.post('/', (req, res) => {
  const { title, contents } = req.body
  
  !title || !contents ? res.status(400).json({ error: "Please provide title and contents" }) :
    db
      .insert(req.body)
      .then(post => {
        res.status(201).json(req.body)
      })
  .catch (err => {
    res.status(500).json({ error: 'There was an error while saving the post to the database' })
  })
})

//Post a Comment (Works on PostMan) <-- Not Understanding Why 404 is not Working
router.post('/:id/comments', (req, res) => {
  const post_id = req.params.id
  const { text } = req.body
  let newComment =
  {
    text,
    post_id,
  }

  db.findById(post_id)
      .then(post => {
        !post
          ? res.status(404).json({ message: 'The post with the specified ID does not exist.' })
          : !text
            ? res.status(400).json({ errorMessage: 'Please provide text for the comment.' })
            : 
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
				
		  })
})

//GET REQUESTS 

//GET (Works on PostMan)
router.get('/', (req, res) => {
  db
			.find()
			.then((info) => {
				res.status(200).json(info)
			})
			.catch((err) => {
				res.status(500).json({
					message: 'There was an error while saving the comment to the database',
				})
			})
})

//GET BY ID (Works on PostMan)<-- Not Understanding Why 404 is not Working
router.get('/:id', (req, res) => {
  const { id } = req.params
  
  db.findById(id)
			.then((info) => {
				!info ? res.status(404).json({ error: `The post with the id of ${id} does not exist.` }) : res.status(200).json(info)
			})
			.catch((err) => {
				res.status(500).json({
					message: 'There was an error while saving the comment to the database',
				})
			})
})

//GET COMMENTS 
router.get('/:id/comments', (req, res) => {
	const {id} = req.params

	db
		.findPostComments(id)
		.then((data) => {
			data.length >= 1 ? res.status(200).json(data) : res.status(404).json({ message: 'The Post ID Does NOT Exist.' })
		})
		.catch((err) => {
			res.status(500).json({
				message: 'The comments information could not be retrieved.',
			})
		})
})


//DELETE (Works on PostMan)
router.delete('/:id', (req, res) => {
	const id = req.params.id
	db
		.findById(id)
		.then(post => {
			post
				? db.remove(id).then(deleted => {
						deleted
							res.status(200).json({ message: `Post ${id} was deleted`, info: post }) 
				  })
				: res.status(404).json({ message: 'That Post ID Does NOT Exist' })
		})
		.catch(err => {
			res.status(500).json({ message: 'The Post Could Not Be Removed' })
		})
})


//PUT (Works on PostMan)
router.put('/:id', (req, res) => {
	const { title, contents } = req.body
	const id = req.params.id

	!title || !contents
		? res.status(400).json({ errorMessage: 'You Did Not Provide Title and Contents for this Post' })
		: db
				.update(id, req.body)
				.then((post) => {
					post ? res.status(200).json(req.body) : res.status(404).json({ message: 'That Post ID Does NOT Exist' })
				})
				.catch((err) => {
					res.status(500).json({
						message: 'There was a problem saving this post',
					})
				})
})

module.exports = router