module.exports = (obejctPagination, query, countProducts) => {
    if(query.page){
        obejctPagination.currentPage = parseInt(query.page);
    }

    obejctPagination.skip = (obejctPagination.currentPage - 1) * obejctPagination.limitItem;
    // console.log(obejctPagination.skip);

    const totalPages = Math.ceil(countProducts / obejctPagination.limitItem);
    // console.log(totalPages);
    obejctPagination.totalPages = totalPages;

    return obejctPagination;
}