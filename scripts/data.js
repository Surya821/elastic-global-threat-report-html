// scripts/data.js
const assets = {
    logo: 'assets/images/logo.png',
    background: 'assets/images/background.png',
    background1: 'assets/images/background1.jpg',
    background2: 'assets/images/background2.jpg',
    background3: 'assets/images/background3.jpg',
    background4: 'assets/images/background4.jpg',
    back: 'assets/images/back.png',
    header: 'assets/images/header.jpg'
};

const sampleData = [
    {
        "Month": "2022-01-01",
        "TVs": 145,
        "Mobile Phones": 335,
        "Laptops": 82,
        "Total": 562
    },
    {
        "Month": "2022-02-01",
        "TVs": 145,
        "Mobile Phones": 362,
        "Laptops": 126,
        "Total": 633
    },
    {
        "Month": "2022-03-01",
        "TVs": 105,
        "Mobile Phones": 311,
        "Laptops": 95,
        "Total": 511
    },
    {
        "Month": "2022-04-01",
        "TVs": 171,
        "Mobile Phones": 259,
        "Laptops": 93,
        "Total": 523
    },
    {
        "Month": "2022-05-01",
        "TVs": 178,
        "Mobile Phones": 277,
        "Laptops": 107,
        "Total": 562
    },
    {
        "Month": "2022-06-01",
        "TVs": 167,
        "Mobile Phones": 292,
        "Laptops": 145,
        "Total": 604
    },
    {
        "Month": "2022-07-01",
        "TVs": 200,
        "Mobile Phones": 385,
        "Laptops": 77,
        "Total": 662
    },
    {
        "Month": "2022-08-01",
        "TVs": 181,
        "Mobile Phones": 388,
        "Laptops": 78,
        "Total": 647
    },
    {
        "Month": "2022-09-01",
        "TVs": 152,
        "Mobile Phones": 291,
        "Laptops": 83,
        "Total": 526
    },
    {
        "Month": "2022-10-01",
        "TVs": 143,
        "Mobile Phones": 345,
        "Laptops": 102,
        "Total": 590
    },
    {
        "Month": "2022-11-01",
        "TVs": 114,
        "Mobile Phones": 399,
        "Laptops": 99,
        "Total": 612
    },
    {
        "Month": "2022-12-01",
        "TVs": 109,
        "Mobile Phones": 250,
        "Laptops": 101,
        "Total": 460
    }
];

const topicData = [
    {
        id: "01",
        topic: "Introduction",
        bg: assets.background1,
        content: [
            {
                type: "text",
                value: "consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, eaducimus nisi, ea nesciunt ratione quaeratconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaeratconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing Lorem ipsum dolor sit amet consectetur, adipisicing Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet ducimus nisi, ea nesciunt ratione quaerat? Consectetur eum non dolorum alias autem quibusdam velit impedit eos perspicLorem ipsum dolor sit amet consectetur, adipisicing elit."
            },
            {
                type: "chart",
                config: {
                    type: "stackbar",
                    title: "Monthly Sales Distribution",
                    description: "This chart shows product-wise sales trends over the year.",
                    source: "sampleData",
                    options: {
                        xKey: "Month",
                        yKeys: ["TVs", "Mobile Phones", "Laptops"]
                    }
                }
            },
            {
                type: "chart",
                config: {
                    type: "pie",
                    title: "Product Contribution Breakdown",
                    description: "This pie chart represents the percentage contribution of each product category.",
                    source: "sampleData",
                    options: {
                        monthIndex: 0,
                        keys: ["TVs", "Mobile Phones", "Laptops"]
                    }
                }
            },
            {
                type: "chart",
                config: {
                    type: "bubble",
                    title: "Sales Volume vs Product Performance",
                    description: "Bubble size indicates total sales while position represents product performance across months.",
                    source: "sampleData",
                    options: {
                        xKey: "TVs",
                        yKey: "Mobile Phones",
                        zKey: "Laptops"
                    }
                }
            },
            {
                type: "table",
                config: {
                    title: "Monthly Product Sales Table",
                    source: "sampleData",
                    columns: ["Month", "TVs", "Mobile Phones", "Laptops", "Total"]
                }
            },
            {
                type: "text",
                value: "consectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, ametconsectetur, adipisicing elit. Debitis dicta autem facere nobis ut quis, amet"
            }
        ]
    }
];

// Export for use in other scripts
window.ReportData = {
    assets,
    sampleData,
    topicData
};