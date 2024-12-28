const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleSchema = new mongoose.Schema({
    title: String,
    article_Category_id: { 
        type: String,
        default: "" 
    },
    content: String,
    author: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { 
        type: String, 
        slug: "title", 
        unique: true 
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        },
    ],
    publishedAt: {
        type: Date 
    },
});

const Article = mongoose.model('Article', articleSchema, 'articles');

module.exports = Article;
