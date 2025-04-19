const express = require('express');
const qs = require('query-string');

const router = express();

router.get('/SearchListing.aspx', (req, res) => {
  const { make, year, model } = req.query;
  const newParams = {
    brandId: make,
    yearId: year,
    modelId: model,
  };
  if (!make && !year && !model) {
    return res.redirect(301, '/value-guide/');
  }
  return res.redirect(301, `/value-guide/search/?${qs.stringify(newParams)}`);
});
router.get('/searchResult/Default.aspx', (req, res) => {
  const { searchTerm } = req.query;
  const newParams = {
    content: searchTerm,
  };
  if (!searchTerm) {
    return res.redirect(301, '/value-guide/');
  }
  return res.redirect(301, `/value-guide/search/?${qs.stringify(newParams)}`);
});
router.get(['/BicycleDatabase.aspx', '/BicycleDatabase.aspx/'], (req, res) => {
  const { make } = req.query;
  if (!make) {
    return res.redirect(301, '/value-guide/');
  }
  return res.redirect(301, `/value-guide/family/${make}/`);
});
router.get('/searchbikes.aspx/', (req, res) => {
  return res.redirect(301, `/value-guide/`);
});
router.get('/SearchListingDetail.aspx', (req, res) => {
  const { make, year, model, id } = req.query;
  const newParams = {
    brandId: make,
    yearId: year,
    modelId: model,
  };
  if (!!id && id.length > 0) {
    return res.redirect(301, `/value-guide/product/${id}`);
  }
  if (!make && !year && !model) {
    return res.redirect(301, '/value-guide/');
  }
  return res.redirect(301, `/value-guide/search/?${qs.stringify(newParams)}`);
});
router.get('/searchbikestolist.aspx', (req, res) => {
  return res.redirect(301, '/value-guide/');
});
router.get('/partnerdirectory.aspx', (req, res) => {
  return res.redirect(301, '/trade-in/');
});
router.get('/HowItWorks.aspx', (req, res) => {
  return res.redirect(301, '/how-to/');
});
router.get('/how-to', (req, res) => {
  return res.redirect(301, '/help/');
});
router.get('/marketplace/buy', (req, res) => {
  return res.redirect(301, '/marketplace/buy-now/');
});
router.get('/marketplace/how', (req, res) => {
  return res.redirect(301, '/help/');
});
router.get('/value-guide/default.aspx', (req, res) => {
  return res.redirect(301, '/value-guide/');
});
router.get('/marketplace/buy-now/default.aspx', (req, res) => {
  return res.redirect(301, '/marketplace/buy-now/');
});
// #endregion

router.get('/DealerGiant/GetList', (req, res) => {
  const { account } = req.query;
  return res.redirect(`https://api.bicyclebluebook.com/auth/api/v1/partner/giant?account=${account}`);
});

module.exports = router;
