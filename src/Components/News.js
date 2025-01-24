import React, {useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

    const capitalizeFirstLetter = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }


    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    document.title = `${capitalizeFirstLetter(props.category)} - NewsFoxy`

    

    const UpdateNews = async () => {
        props.setProgress(30);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(50);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100);
    }

    useEffect(() => {
        UpdateNews();
        // eslint-disable-next-line
    }, [])


    // const handleNextClick = async () => {
    //     setPage(page + 1);
    //     UpdateNews()
    // }


    // const handlePrevClick = async () => {
    //     setPage(page - 1);
    //     UpdateNews()
    // }

    const fetchMoreData = async () => {
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        // setLoading(true);
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
        setLoading(false)
    };

    return (
        <div className="container">
            <h1 className='text-center' style={{marginTop : "80px"}}>NewsFoxy - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={loading && <Spinner />}
            ></InfiniteScroll>
            <div className="container">
                <div className="row my-4">
                    {articles.map((element, index) => {
                        return <div className="col-md-4" key={index}>
                            <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                        </div>
                    })
                    }
                </div>
            </div>
        </div>
    )
}

News.defaultProps = {
    country: 'us',
    pageSize: 6,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
