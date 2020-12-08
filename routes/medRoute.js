const express = require('express');
const router = express.Router();
const Med = require('../models/Med');

router.get('/meds', async (req, res) => {
  try {
    const allMeds = await Med.find();
    res.json(allMeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Filter data.
router.get('/meds/:filterString', async (req, res) => {
  try {
    
    const filterMeds = await Med.find({
      $or: [
        {drug_company: {$regex: req.params.filterString, $options: "i"}},
        {drug_brand_name: {$regex: req.params.filterString, $options: "i"}},
        {drug_generic_name: {$regex: req.params.filterString, $options: "i"}},
      ]
    })
    res.json(filterMeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//middleware
async function getMed(req, res, next) {
  let med;
  try {
    //find record by id
    med = await Med.findById(req.params.id);

    //if no match, report error
    if (med == null) {
      return res
        .status(404)
        .json({ message: 'Cannot find that plant record.' });
    }
  } catch (err) {
    //general error
    return res.status(500).json({ message: err.message });
  }
  res.med = med;
  //another id
  next();
}

//Get single entity.
router.get('/med/:id', getMed, (req, res) => {
  res.json(res.med);
});

// Create new entity
router.post('/med/new', async (req, res) => {
  const med = new Med({
    drug_company: req.body.drug_company,
    drug_brand_name: req.body.drug_brand_name,
    drug_generic_name: req.body.drug_generic_name,
  });
  try {
    const newMed = await med.save();
    res.status(201).json({ newMed });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Update the entity.
router.put('/med/:id', getMed, async (req, res) => {
  try {
    const updatingEntity = new Med({
      _id: res.med._id,
      drug_company: res.med.drug_company,
      drug_brand_name: res.med.drug_brand_name,
      drug_generic_name: res.med.drug_generic_name,
    });
    const updateMed = await updatingEntity.updateOne(req.body);
    console.log(updateMed, '>>>>>Backend');
    res.json(updateMed);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Delete the entity
router.delete('/med/:id', getMed, async (req, res) => {
  try {
    await res.med.deleteOne();
    res.json({ message: 'Delete entity successfully.' });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
