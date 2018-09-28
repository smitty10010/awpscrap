
module.exports = (app, axios, cheerio) => {

    app.get("/scrape", (req,res) => {
        axios.get("https://www.awpwriter.org/magazine_media/writers_news").then((response)=> { 
            const $ = cheerio.load(response.data);
            $("div li").each((i, element) =>{ 
                const result = {}; 
                result.date = $(this).children("p").text();
                result.title = $(this).children("a").text();result.link = $(this).children("a").attr("href")

                db.Article.create(result).then((dbArticle) => {
                    console.log(dbArticle);
                }).catch((err)=>{
                    res.json(err);
                });
            });
            res.send("Scrape Complete");
        });
    });

    app.get

};
