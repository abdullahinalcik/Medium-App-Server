"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// app.use(findSearchSortPage):

module.exports = (req, res, next) => {
  // Searching & Sorting & Pagination:

  // SEARCHING: URL?search[key1]=value1&search[key2]=value2
  let search = req.query?.search || {};
  for (let key in search) search[key] = { $regex: search[key], $options: "i" };

  // SORT
  const sort = req.query?.sort || {};

  // PAGINATION: URL?page=1&limit=10
  // LIMIT:
  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env?.PAGE_SIZE || 20);

  // PAGE:
  let page = Number(req.query?.page);
  page = (page > 0 ? page : 1) - 1;
  
  // SKIP:
  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  // Run SearchingSortingPagination engine for Model:
  res.getModelList = async function (Model, filters = {}, populate = null) {
    const filtersAndSearch = { ...filters, ...search };

    // return await Model.find(filtersAndSearch).sort(sort).skip(skip).limit(limit).populate(populate)
    // FOR REACT PROJECT:
    return await Model.find(filtersAndSearch).populate(populate);
  };

  // Details:
  res.getModelListDetails = async function (Model, filters = {}) {
    const filtersAndSearch = { ...filters, ...search };

    const dataCount = await Model.countDocuments(filtersAndSearch)      
    // const dataCount = await Model.find(filtersAndSearch).count()

    let details = {
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2,
        total: Math.ceil(dataCount / limit),
      },
      totalRecords: dataCount,
    };
    details.pages.next =
      details.pages.next > details.pages.total ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};