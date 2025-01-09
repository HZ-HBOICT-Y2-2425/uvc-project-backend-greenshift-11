import express from "express";

// Initialize Express application
const app = express();
const PORT = 3011;

/**
 * Articles database organized by environmental sustainability categories.
 * Each article object contains consistent properties:
 * - title: The article's headline or main title
 * - snippet: A brief description of the article's content
 * - link: The URL to the full article
 * - image: (optional) Associated image filename
 */
const articles = {
    // Energy efficiency articles and resources
    energy_efficiency: [
        {
            title: "Energy Efficiency: The Clean Facts",
            snippet: "Discover the benefits of energy efficiency and how it can help reduce your carbon footprint.",
            image: "Screenshot 2025-01-07 112613.png",
            link: "https://www.nrdc.org/stories/energy-efficiency-clean-facts"
        },
        {
            title: "Energy Efficiency: The Key to a Sustainable Future",
            snippet: "Learn how energy efficiency can help reduce greenhouse gas emissions and create a more sustainable future.",
            image: "Screenshot 2025-01-07 111906.png",
            link: "https://www.sciencedirect.com/science/article/abs/pii/S1342937X23001077"
        },
        {
            title: "All You Need to Know About Energy Efficiency",
            snippet: "A comprehensive guide to understanding and implementing energy efficiency practices.",
            link: "https://greenly.earth/en-us/blog/company-guide/all-you-need-to-know-about-energy-efficiency"
        },
        {
            title: "Energy Efficiency Journal",
            snippet: "Academic journal covering the latest research in energy efficiency.",
            link: "https://link.springer.com/journal/12053"
        },
        {
            title: "Energy Efficiency Research",
            snippet: "Scientific research on energy efficiency implementation and outcomes.",
            link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3869478/"
        }
    ],

    // Water conservation resources
    water_conservation: [
        {
            title: "The Importance of Water Conservation",
            snippet: "Understanding why water conservation matters for our future and how to implement effective water-saving strategies.",
            link: "https://nuwater.com/the-importance-of-water-conservation/"
        },
        {
            title: "Saving Water for a Sustainable Future",
            snippet: "Comprehensive guide on water conservation methods and their environmental impact.",
            link: "https://www.green.earth/saving-water"
        },
        {
            title: "5 Best Practices for Water Conservation",
            snippet: "Detailed analysis of proven water conservation techniques for both residential and commercial use.",
            link: "https://greenly.earth/en-us/blog/company-guide/5-best-practices-for-water-conservation"
        },
        {
            title: "Water Conservation: Scientific Perspectives",
            snippet: "Research-based approaches to water conservation and resource management.",
            link: "https://www.sciencedirect.com/science/article/abs/pii/S030147972201057X"
        },
        {
            title: "Water Conservation Fundamentals",
            snippet: "Expert insights into the principles and practices of effective water conservation.",
            link: "https://www.sciencedirect.com/topics/earth-and-planetary-sciences/water-conservation"
        }
    ],

    // Carbon footprint reduction strategies
    reducing_carbon_footprint: [
        {
            title: "How to Reduce Your Carbon Footprint",
            snippet: "Practical guide for individuals looking to minimize their environmental impact through daily choices.",
            link: "https://youth.europa.eu/get-involved/sustainable-development/how-reduce-my-carbon-footprint_en"
        },
        {
            title: "Carbon Footprint Reduction Research",
            snippet: "Latest scientific findings on effective carbon footprint reduction methods.",
            link: "https://www.sciencedirect.com/science/article/pii/S1674987123001652"
        },
        {
            title: "Hidden Ways to Reduce Carbon Footprint",
            snippet: "Exploring lesser-known but effective methods for reducing personal carbon emissions.",
            link: "https://www.science.org/content/article/best-way-reduce-your-carbon-footprint-one-government-isn-t-telling-you-about"
        },
        {
            title: "Climate Change Mitigation Strategies",
            snippet: "Comprehensive overview of emission reduction techniques and their effectiveness.",
            link: "https://www.eea.europa.eu/en/topics/in-depth/climate-change-mitigation-reducing-emissions"
        },
        {
            title: "Practical Steps to Reduce Carbon Footprint",
            snippet: "Expert-recommended actions for meaningful carbon footprint reduction.",
            link: "https://www.bbc.com/future/article/20230421-what-are-the-best-ways-to-reduce-carbon-footprint"
        }
    ],

    // Recycling information and best practices
    recycling: [
        {
            title: "How Recycling Impacts Climate Change",
            snippet: "Understanding the relationship between recycling practices and climate protection.",
            link: "https://www.bbc.com/future/article/20230317-how-recycling-can-help-the-climate-and-other-facts"
        },
        {
            title: "The Economics of Recycling",
            snippet: "Analysis of recycling's economic implications and benefits for society.",
            link: "https://www.econlib.org/library/Enc/Recycling.html"
        },
        {
            title: "The Truth About Recycling and Climate",
            snippet: "Evidence-based examination of recycling's role in climate change mitigation.",
            link: "https://yaleclimateconnections.org/2024/02/does-recycling-actually-help-the-climate/"
        },
        {
            title: "Expert Answers on Recycling",
            snippet: "Professional insights into common recycling questions and misconceptions.",
            link: "https://www.nytimes.com/2024/06/17/climate/ask-nyt-climate-recycling.html"
        },
        {
            title: "Latest Research in Recycling",
            snippet: "Current scientific findings on recycling technologies and their environmental impact.",
            link: "https://www.sciencedirect.com/science/article/pii/S2452223623000123"
        }
    ],

    // Sustainable transportation methods
    sustainable_transport: [
        {
            title: "The Road to Sustainable Transport",
            snippet: "Exploring various sustainable transportation solutions and their implementation.",
            link: "https://www.iisd.org/articles/deep-dive/road-sustainable-transport"
        },
        {
            title: "Sustainable Transportation Solutions",
            snippet: "Comprehensive review of current and future sustainable transport options.",
            link: "https://www.researchgate.net/publication/377807211_A_Review_of_sustainable_transportation_solutions_Innovations_challenges_and_future_directions"
        },
        {
            title: "Future of Sustainable Transport",
            snippet: "Analysis of emerging trends and technologies in sustainable transportation.",
            link: "https://www.sciencedirect.com/science/article/pii/S0386111214602235"
        },
        {
            title: "Electric Vehicle Revolution",
            snippet: "Understanding the transition to electric vehicles and their environmental impact.",
            link: "https://www.nature.com/articles/d41586-020-02964-4"
        },
        {
            title: "Public Transit Sustainability",
            snippet: "Examining the role of public transportation in sustainable urban development.",
            link: "https://www.sciencedirect.com/science/article/pii/S2590198220300518"
        }
    ],

    // Sustainable food practices
    sustainable_food: [
        {
            title: "Sustainable Food Production Research",
            snippet: "Scientific analysis of sustainable food production methods and their outcomes.",
            link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8755053/"
        },
        {
            title: "Economic Benefits of Sustainable Food",
            snippet: "Understanding the financial advantages of sustainable food production.",
            link: "https://www.theguardian.com/environment/2024/jan/29/sustainable-food-production-economic-benefits-study"
        },
        {
            title: "Future of Sustainable Agriculture",
            snippet: "Exploring innovative approaches to sustainable food production.",
            link: "https://www.nature.com/articles/s43016-021-00458-8"
        },
        {
            title: "Urban Farming Solutions",
            snippet: "Investigating the potential of urban agriculture in sustainable food systems.",
            link: "https://www.sciencedirect.com/science/article/pii/S2211912419300123"
        },
        {
            title: "Sustainable Food Supply Chains",
            snippet: "Analysis of sustainable practices in food distribution and supply.",
            link: "https://www.sciencedirect.com/science/article/pii/S0959652619303233"
        }
    ],

    // Sustainable lifestyle practices
    sustainable_lifestyle: [
        {
            title: "The Urgency of Sustainable Living",
            snippet: "Understanding why sustainable lifestyle choices matter now more than ever.",
            link: "https://www.econyl.com/magazine/the-urgency-of-sustainable-living-and-why-we-cant-wait/"
        },
        {
            title: "Guide to Sustainable Living",
            snippet: "Practical steps and strategies for adopting a sustainable lifestyle.",
            link: "https://www.worldpackers.com/articles/sustainable-living"
        },
        {
            title: "UNEP Sustainable Lifestyles",
            snippet: "Official guide to sustainable living practices and their environmental impact.",
            link: "https://www.unep.org/explore-topics/resource-efficiency/what-we-do/sustainable-lifestyles"
        },
        {
            title: "Modern Sustainable Living",
            snippet: "Contemporary approaches to sustainable lifestyle choices and their benefits.",
            link: "https://www.nytimes.com/topic/subject/sustainable-living"
        },
        {
            title: "Sustainable Living Research",
            snippet: "Scientific studies on the effectiveness of sustainable lifestyle practices.",
            link: "https://www.sciencedirect.com/science/article/pii/S2352550919302696"
        }
    ],

    // Smart home technology
    smart_home_technology: [
        {
            title: "The Evolution of Smart Homes",
            snippet: "Understanding how smart home technology is transforming sustainable living.",
            link: "https://www.forbes.com/councils/forbestechcouncil/2023/09/05/smarter-homes-moving-from-tech-for-techs-sake-to-tech-with-a-purpose/"
        },
        {
            title: "Smart Home Technology Impact",
            snippet: "Analysis of how smart technology is changing modern living.",
            link: "https://insightss.co/blogs/the-rise-of-the-smart-home-how-technology-is-changing-the-way-we-live/"
        },
        {
            title: "Smart Home User Perceptions",
            snippet: "Research into how people interact with and benefit from smart home technology.",
            link: "https://www.researchgate.net/publication/327136969_Smart_Home_Technology_An_Exploration_of_End_User_Perceptions"
        },
        {
            title: "Future of Smart Homes",
            snippet: "Latest developments and trends in smart home technology.",
            link: "https://www.sciencedirect.com/science/article/pii/S2542660523002676"
        },
        {
            title: "Smart Home Basics Explained",
            snippet: "Comprehensive guide to understanding and implementing smart home technology.",
            link: "https://www.theverge.com/23749376/smart-home-explained-voice-assistant-tv-gadgets"
        }
    ],

    // Repair versus replace decisions
    repair_vs_replace: [
        {
            title: "The 50 Percent Rule",
            snippet: "Understanding when to repair or replace household items based on cost analysis.",
            link: "https://artoftroubleshooting.com/2014/04/25/the-50-percent-rule-repair-or-replace-revisited/"
        },
        {
            title: "Expert Guide to Repair Decisions",
            snippet: "Professional advice on making repair or replace decisions for common items.",
            link: "https://www.theguardian.com/lifeandstyle/2021/apr/27/repair-or-replace-an-expert-guide-to-fixing-or-ditching-eight-essential-household-items"
        },
        {
            title: "Equipment Maintenance Decisions",
            snippet: "Strategic approach to equipment repair and replacement choices.",
            link: "https://zoidii.com/blogpost/repair-or-replace-equipment"
        },
        {
            title: "Consumer's Repair Dilemma",
            snippet: "Analysis of factors affecting consumer repair or replace decisions.",
            link: "https://www.linkedin.com/pulse/replace-repair-consumers-dilemma-vinod-tripathi"
        },
        {
            title: "Facility Management Guide",
            snippet: "Professional guidance on repair versus replacement decisions in facilities.",
            link: "https://blog.radwell.co.uk/repair-or-replace-choosing-the-best-option-for-your-facility-0"
        }
    ]
};

/**
 * Get articles for a specific category.
 * @param {Object} req - Express request object with category parameter
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with articles or error message
 */
export const getArticlesByCategory = (req, res) => {
    const { category } = req.params;
    
    if (articles[category]) {
        res.status(200).json({ articles: articles[category] });
    } else {
        res.status(404).json({ error: "Category not found" });
    }
};

/**
 * Get all available article categories.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of category names
 */
export const getAllCategories = (req, res) => {
    res.status(200).json({ categories: Object.keys(articles) });
};

// Export the articles data structure for potential use in other modules
export const articleData = articles;
