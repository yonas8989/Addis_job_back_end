"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIFeatures = void 0;
// Class to handle API query features (filter, sort, project, paginate)
class APIFeatures {
    constructor(dbQuery, reqQuery, searchFields) {
        this.reqQuery = {};
        this.searchFields = ["title"];
        this.dbQuery = dbQuery;
        if (searchFields) {
            this.searchFields = this.searchFields.concat(searchFields);
        }
        if (reqQuery) {
            this.reqQuery = reqQuery;
        }
    }
    // Filter query based on request
    filter() {
        let queryObj = Object.assign({}, this.reqQuery);
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(function (el) {
            delete queryObj[el];
        });
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
            return `$${match}`;
        });
        queryObj = JSON.parse(queryStr);
        this.searchFields.forEach((field) => {
            if (queryObj[field]) {
                const value = queryObj[field];
                queryObj[field] = { $regex: new RegExp(value, "i") };
            }
        });
        this.dbQuery = this.dbQuery.find(queryObj);
        return this;
    }
    // Sort query results
    sort() {
        if (this.reqQuery.sort) {
            const sortValue = this.reqQuery.sort;
            this.dbQuery.sort(sortValue.split(",").join(" "));
        }
        else {
            this.dbQuery.sort("-createdAt");
        }
        return this;
    }
    // Select specific fields to project in the query
    project() {
        if (this.reqQuery.fields) {
            const projectValue = this.reqQuery.fields;
            this.dbQuery.select(projectValue.split(",").join(" "));
        }
        else {
            this.dbQuery.select("-_v");
        }
        return this;
    }
    // Paginate query results
    paginate() {
        const page = this.reqQuery.page || 1;
        const limit = this.reqQuery.limit || 10;
        const skip = (page - 1) * limit;
        this.dbQuery.skip(skip).limit(limit);
        return this;
    }
}
exports.APIFeatures = APIFeatures;
