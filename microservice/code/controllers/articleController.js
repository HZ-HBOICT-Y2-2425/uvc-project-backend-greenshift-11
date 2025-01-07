import express from "express";
const app = express();
const PORT = 3011;

const articles = {
    energy_efficiency: [
       `https://www.nrdc.org/stories/energy-efficiency-clean-facts`,
       `https://www.sciencedirect.com/science/article/abs/pii/S1342937X23001077`,
       `https://greenly.earth/en-us/blog/company-guide/all-you-need-to-know-about-energy-efficiency`,
       `https://link.springer.com/journal/12053`,
       `https://pmc.ncbi.nlm.nih.gov/articles/PMC3869478/`,
    ],
    water_conservation: [
        `https://nuwater.com/the-importance-of-water-conservation/`,
        `https://www.green.earth/saving-water`,
        `https://greenly.earth/en-us/blog/company-guide/5-best-practices-for-water-conservation`,
        `https://www.sciencedirect.com/science/article/abs/pii/S030147972201057X`,
        `https://www.sciencedirect.com/topics/earth-and-planetary-sciences/water-conservation`
    ],
    reducing_carbon_footprint: [
        `https://youth.europa.eu/get-involved/sustainable-development/how-reduce-my-carbon-footprint_en`,
        `https://www.sciencedirect.com/science/article/pii/S1674987123001652`,
        `https://www.science.org/content/article/best-way-reduce-your-carbon-footprint-one-government-isn-t-telling-you-about`,
        `https://www.eea.europa.eu/en/topics/in-depth/climate-change-mitigation-reducing-emissions`,
        `https://www.bbc.com/future/article/20230421-what-are-the-best-ways-to-reduce-carbon-footprint`

    ],
    recycling: [
        `https://www.bbc.com/future/article/20230317-how-recycling-can-help-the-climate-and-other-facts`,
        `https://www.econlib.org/library/Enc/Recycling.html`,
        `https://yaleclimateconnections.org/2024/02/does-recycling-actually-help-the-climate/`,
        `https://www.nytimes.com/2024/06/17/climate/ask-nyt-climate-recycling.html`,
        `https://www.sciencedirect.com/science/article/pii/S2452223623000123`
    ],
    sustainable_transport: [
        `https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj9o5zew8OKAxU0pYMHHQWIIu8YABAGGgJlZg&ae=2&aspm=1&co=1&ase=5&gclid=Cj0KCQiA9667BhDoARIsANnamQYudae9OaID-dOQDckcT9vFhFqlkQ1I4rjpMmIocFr3z8WfjjNfrOsaAuASEALw_wcB&ohost=www.google.com&cid=CAESV-D2fDzyyqGPEcTjrKd82ba3nQWqzEzJhubOPki7Lo38AVG0HF1QtAjIfK14-NUVO8AXd3ktlR6yvNFujVuE0y3TVworn1vq1H4oPM5ph-osvfRVuyITGQ&sig=AOD64_1Ll74UeyAhnUN6Q05fkubSOptFbA&q&adurl&ved=2ahUKEwjJ8JXew8OKAxXL7AIHHbz4KgUQ0Qx6BAgGEAE`,
        `https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj9o5zew8OKAxU0pYMHHQWIIu8YABAEGgJlZg&ae=2&aspm=1&co=1&ase=5&gclid=Cj0KCQiA9667BhDoARIsANnamQZTW2KSPAyZ2ciLjsfkMq1SPMBIHwX6QRSOGqX3DVkOFBH5ZSC0x5AaAj6HEALw_wcB&ohost=www.google.com&cid=CAESV-D2fDzyyqGPEcTjrKd82ba3nQWqzEzJhubOPki7Lo38AVG0HF1QtAjIfK14-NUVO8AXd3ktlR6yvNFujVuE0y3TVworn1vq1H4oPM5ph-osvfRVuyITGQ&sig=AOD64_3uJTbiqabx9pt6KISMTftql5S2NA&q&adurl&ved=2ahUKEwjJ8JXew8OKAxXL7AIHHbz4KgUQ0Qx6BAgKEAE`,
        `https://www.iisd.org/articles/deep-dive/road-sustainable-transport`,
        `https://www.researchgate.net/publication/377807211_A_Review_of_sustainable_transportation_solutions_Innovations_challenges_and_future_directions`,
        `https://www.sciencedirect.com/science/article/pii/S0386111214602235`

    ],
    sustainable_food: [
        `https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj5hLuUxMOKAxX0l4MHHSVuNvMYABABGgJlZg&ae=2&aspm=1&co=1&ase=5&gclid=Cj0KCQiA9667BhDoARIsANnamQY-Lek8fH5CRlb28-Zed2KYhjRVunLcF4RuPufc8nWEbL3YvTBh98saAv2yEALw_wcB&ohost=www.google.com&cid=CAESV-D2TSkz-Na6ss8xV8QPtJiUae4-k3mvKwCbyjD-nseihGo-4YQu2znp0kJX7VZ7aexBsKqJGPBetltJJn3OmYDcWMuByQozrRfEJANQ0sRvdQAd3KxuxQ&sig=AOD64_0p3RPjKWTSTCmcG00a6WWNq_tCCw&q&adurl&ved=2ahUKEwiM17SUxMOKAxWk2AIHHX7ZMWEQ0Qx6BAgLEAM`,
        `https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj5hLuUxMOKAxX0l4MHHSVuNvMYABAEGgJlZg&ae=2&aspm=1&co=1&ase=5&gclid=Cj0KCQiA9667BhDoARIsANnamQYl77MDUFFxWNjVPqjah7RYjN6Rnd-f8mI9ScCGtzJfFHcmvGSY6dMaAoeIEALw_wcB&ohost=www.google.com&cid=CAESV-D2TSkz-Na6ss8xV8QPtJiUae4-k3mvKwCbyjD-nseihGo-4YQu2znp0kJX7VZ7aexBsKqJGPBetltJJn3OmYDcWMuByQozrRfEJANQ0sRvdQAd3KxuxQ&sig=AOD64_04FIt9oQ6aJ3HNugCZYGML6w613A&q&adurl&ved=2ahUKEwiM17SUxMOKAxWk2AIHHX7ZMWEQ0Qx6BAgKEAE`,
        `https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj5hLuUxMOKAxX0l4MHHSVuNvMYABAFGgJlZg&ae=2&aspm=1&co=1&ase=5&gclid=Cj0KCQiA9667BhDoARIsANnamQY0MCLSshwff-7Sv4shXE5gTZnWrDl_mtje-2OyI3gk6fvA-VArrHwaAvKSEALw_wcB&ohost=www.google.com&cid=CAESV-D2TSkz-Na6ss8xV8QPtJiUae4-k3mvKwCbyjD-nseihGo-4YQu2znp0kJX7VZ7aexBsKqJGPBetltJJn3OmYDcWMuByQozrRfEJANQ0sRvdQAd3KxuxQ&sig=AOD64_1ulkn5QNcSgOIGRLR4EvB-tAlVSA&q&adurl&ved=2ahUKEwiM17SUxMOKAxWk2AIHHX7ZMWEQ0Qx6BAgXEAE`,
        `https://pmc.ncbi.nlm.nih.gov/articles/PMC8755053/`,
        `https://www.theguardian.com/environment/2024/jan/29/sustainable-food-production-economic-benefits-study`
    ],
    sustainable_lifestyle: [
        `https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwiYqIrjxMOKAxUTnoMHHUnQObcYABADGgJlZg&ae=2&aspm=1&co=1&ase=5&gclid=Cj0KCQiA9667BhDoARIsANnamQaaEGH8HgKCNcJDNEPEAmQapGyqWzockTTKN_KWq35r0OAD12uOZP0aAhxJEALw_wcB&ohost=www.google.com&cid=CAESV-D2fQt2n8Fn0xN8ANfIhz2r9OFWyCmYBNM__D9MorJsWJ36ZM0WJT6bP0E_bjbiaOVRfGMPp3ktZ75KEe1XQQRhNFEWD8RyTJ1lN4MxMoJ3tudbxqd-Sg&sig=AOD64_0XXb5XA6m2l0oG_JuQWpHm-iakAQ&q&adurl&ved=2ahUKEwj1kIPjxMOKAxVaxAIHHSi6GrwQ0Qx6BAgMEAE`,
        `https://www.unep.org/explore-topics/resource-efficiency/what-we-do/sustainable-lifestyles`,
        `https://www.econyl.com/magazine/the-urgency-of-sustainable-living-and-why-we-cant-wait/`,
        `https://www.worldpackers.com/articles/sustainable-living`,
        `https://www.nytimes.com/topic/subject/sustainable-living`
    ],
    smart_home_technology: [
        `https://www.forbes.com/councils/forbestechcouncil/2023/09/05/smarter-homes-moving-from-tech-for-techs-sake-to-tech-with-a-purpose/`,
        `https://insightss.co/blogs/the-rise-of-the-smart-home-how-technology-is-changing-the-way-we-live/`,
        `https://www.researchgate.net/publication/327136969_Smart_Home_Technology_An_Exploration_of_End_User_Perceptions`,
        `https://www.sciencedirect.com/science/article/pii/S2542660523002676`,
        `https://www.theverge.com/23749376/smart-home-explained-voice-assistant-tv-gadgets`
    ],
    repair_vs_replace: [
        `https://artoftroubleshooting.com/2014/04/25/the-50-percent-rule-repair-or-replace-revisited/`,
        `https://www.theguardian.com/lifeandstyle/2021/apr/27/repair-or-replace-an-expert-guide-to-fixing-or-ditching-eight-essential-household-items`,
        `https://zoidii.com/blogpost/repair-or-replace-equipment`,
        `https://www.linkedin.com/pulse/replace-repair-consumers-dilemma-vinod-tripathi`,
        `https://blog.radwell.co.uk/repair-or-replace-choosing-the-best-option-for-your-facility-0`
    ],
};

  export const getArticlesByCategory = (req, res) => {
    const { category } = req.params;
    if (articles[category]) {
      res.status(200).json({ articles: articles[category] });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  };
  
    export const getAllCategories = (req, res) => {
        res.status(200).json({ categories: Object.keys(articles) });
    };