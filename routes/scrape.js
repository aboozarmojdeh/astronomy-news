//Dependencies
const express = require('express'),
  cheerio = require('cheerio'),
  rp = require('request-promise'),
  router = express.Router(),
  db = require('../models');

//route to scrape new articles
router.get("/newArticles", function (req, res) {
  //configuring options object for request-promist
  const options = {
    uri: 'http://www.astronomy.com/news',
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  //calling the database to return all saved articles
  db.Article
    .find({})
    .then((savedArticles) => {
      //creating an array of saved article headlines
      let savedHeadlines = savedArticles.map(article => article.headline);

      //calling request promist with options object
      rp(options)
        .then(function ($) {
          let newArticleArr = [];
          //iterating over returned articles, and creating a newArticle object from the data
          $('.dataItem').each((i, element) => {
            
            ////Image URL making/////////////////
            let imageLink = "http://www.astronomy.com" + $(element)
              .children().find("img")
              .attr("src");
            let modifiedImageLink = imageLink.replace(/ /g, "%20")
            console.log("image link:"+modifiedImageLink)
            /////////////////////////

            let newArticle = new db.Article({
              title: $(element).children().find("h2").text(),
              link: "http://www.astronomy.com" + $(element).children().find("a").attr("href"),
              description: $(element).children().find(".snippet").text(),
              img: modifiedImageLink


              // storyUrl: $(element).find('.story-body>.story-link').attr('href'),
              // headline: $(element).find('h2.headline').text().trim(),
              // summary : $(element).find('p.summary').text().trim(),
              // imgUrl  : $(element).find('img').attr('src'),
              // byLine  : $(element).find('p.byline').text().trim()
            });
            console.log(newArticle)
            //checking to make sure newArticle contains a storyUrl
            if (newArticle.link) {
              //checking if new article matches any saved article, if not add it to array
              //of new articles
              if (!savedHeadlines.includes(newArticle.title)) {
                newArticleArr.push(newArticle);
              }
            }
          });//end of each function

          //adding all new articles to database
          db.Article
            .create(newArticleArr)
            .then(result => res.json({ count: newArticleArr.length }))//returning count of new articles to front end
            .catch(err => { });
        })
        .catch(err => console.log(err)); //end of rp method
    })
    .catch(err => console.log(err)); //end of db.Article.find()
});// end of get request to /scrape

module.exports = router;
