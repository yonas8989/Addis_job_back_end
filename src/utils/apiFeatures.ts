import { Query, Document } from "mongoose";

export class APIFeatures<T extends Document> {
  reqQuery: RequestQuery = {};
  dbQuery: Query<T[], T>;
  searchFields: string[] = ["title"];

  constructor(
    dbQuery: Query<T[], T>,
    reqQuery?: RequestQuery,
    searchFields?: string[]
  ) {
    this.dbQuery = dbQuery;
    if (searchFields) {
      this.searchFields = this.searchFields.concat(searchFields);
    }
    if (reqQuery) {
      this.reqQuery = reqQuery;
    }
  }

  filter(): APIFeatures<T> {
    let queryObj = { ...this.reqQuery };
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

    // if (queryObj["title"]) {
    //   const title = queryObj["title"];
    //   queryObj = { ...queryObj, title: { $regex: new RegExp(title, "i") } };
    // }

    this.dbQuery = this.dbQuery.find(queryObj);

    return this;
  }

  sort(): APIFeatures<T> {
    if (this.reqQuery.sort) {
      const sortValue: string = this.reqQuery.sort;
      this.dbQuery.sort(sortValue.split(",").join(" "));
    } else {
      this.dbQuery.sort("-createdAt");
    }
    return this;
  }

  project(): APIFeatures<T> {
    if (this.reqQuery.fields) {
      const projectValue = this.reqQuery.fields;
      this.dbQuery.select(projectValue.split(",").join(" "));
    } else {
      this.dbQuery.select("-_v");
    }
    return this;
  }

  paginate(): APIFeatures<T> {
    const page = this.reqQuery.page || 1;
    const limit = this.reqQuery.limit || 10;
    const skip = (page - 1) * limit;
    this.dbQuery.skip(skip).limit(limit);
    return this;
  }
}
