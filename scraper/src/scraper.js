import { OpenLinks, Root, Scraper } from "nodejs-web-scraper";
import * as cheerio from "cheerio";
import { convertDate, getFirstNumber } from "./helper/utils.js";
import { saveConcatToCsv, saveToCsv } from "./helper/fs_helper.js";

(async () => {
    let booksData = [];
    let ratingData = [];

    const getPageHtml = (html, address) => {
        const $ = cheerio.load(html);

        let id, link, series, author, author_link, rating_count,
            review_count, number_of_pages, date_published, publisher,
            original_title, genre_and_votes, isbn, isbn13, settings,
            characters, description, title, awards;
        let rating;
        
        link = address;
        series = $('a[href*="series"]').first().text();
        
        author = $('a[href*="author"] > span[data-testid="name"]').last().text();
        author_link = $('a[href*="author"]:has(span[data-testid="name"])').last().attr('href');
        
        rating_count = getFirstNumber($('[data-testid="ratingsCount"]').first().text().replace(/,/g,''));
        review_count = getFirstNumber($('[data-testid="reviewsCount"]').first().text().replace(/,/g,''));

        number_of_pages = getFirstNumber($('[data-testid="pagesFormat"]').first().text().replace(/,/g,''));
        date_published = $('[data-testid="publicationInfo"]').first().text().split('First published').pop().trim();

        rating = $('.RatingStatistics__rating').first().text();

        const script = JSON.parse($('script#__NEXT_DATA__').text());
        if (script) {
            const keys = Object.keys(script.props.pageProps.apolloState);

            const Book_key = keys.filter(key => key.startsWith('Book'))[0];
            const Book = script.props.pageProps.apolloState[Book_key];

            if (Book?.legacyId) id = parseInt(Book.legacyId);

            if (Book?.details?.publicationTime) date_published = convertDate(Book.details.publicationTime);
            if (Book?.details?.publisher) publisher = Book.details.publisher;
            
            if (Book?.title) title = Book.title;
            if (Book?.title) original_title = Book.title;
            
            if (Book?.bookGenres)
                genre_and_votes = Book.bookGenres.map(val => val.genre.name).join(', ');
            
            if (Book?.description)
                description = $(Book.description).text();

            if (Book?.details?.isbn) isbn = parseInt(Book.details.isbn);
            if (Book?.details?.isbn13) isbn13 = parseInt(Book.details.isbn13);

            const Work_key = keys.filter(key => key.startsWith('Work'))[0];
            const Work = script.props.pageProps.apolloState[Work_key];

            if (Work?.details?.places)
                settings = Work.details.places.map(val => val.name).join(', ');
            if (Work?.details?.characters)
                characters = Work.details.characters.map(val => val.name).join(', ');
            if (Work?.details?.awardsWon)
                awards = Work.details.awardsWon.map(val => val.name).join(', ');
        }

        const bD = {
            id,
            link,
            series,
            author,
            author_link,
            rating_count,
            review_count,
            number_of_pages,
            date_published,
            publisher,
            original_title,
            genre_and_votes,
            isbn,
            isbn13,
            settings,
            characters,
            description,
            title,
            awards,
        }
        const rD = {
            id,
            rating,
        }

        // saveConcatToCsv("data/X_1.csv", bD, booksData.length);
        // saveConcatToCsv("data/y_1.csv", rD, ratingData.length);
        
        booksData.push(bD);
        ratingData.push(rD);
    }

    const scraper = new Scraper({
        baseSiteUrl: `https://www.goodreads.com`,
        startUrl: `https://www.goodreads.com/list/show/1.Best_Books_Ever`,
        filePath: './data/',
        concurrency: 20,
        maxRetries: 3,
        logPath: './logs/',
        removeStyleAndScriptTags: false,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.goodreads.com/list/show/1.Best_Books_Ever',
            'Cookie': 'ccsid=961-0254113-9075111; locale=en; _session_id2=726259c53264f38c2bf04dd6c3902b98; __qca=P0-108101381-1704785718330; blocking_sign_in_interstitial=true; csm-sid=965-7735200-9073505',

        }
    });

    const root = new Root({
        pagination: {
            queryString: 'page',
            begin: 1,
            end: 1,
        }
    });

    const books = new OpenLinks('a.bookTitle', {
        name: 'books',
        getPageHtml,
        slice: [0,10]
    });

    root.addOperation(books);

    await scraper.scrape(root);

    saveToCsv("data/X.csv", booksData);
    saveToCsv("data/y.csv", ratingData);
})();