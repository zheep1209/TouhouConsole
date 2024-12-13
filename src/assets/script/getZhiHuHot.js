const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.zhihu.com/hot';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'cookie': '_xsrf=HLWZT2CwSiUtYUyLdMOL99FAsnmIUqfZ; _zap=51062b33-9cb4-480a-ae2d-fe21de61052f; d_c0=ABBSsf5bdBmPTjc8DEWp-11tYAo0fD7c_rM=|1730085473; q_c1=41788ca6ac8240d780efee148c460c57|1730158108000|1730158108000; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1731973207,1731979069,1732011211,1732066141; z_c0=2|1:0|10:1732712158|4:z_c0|80:MS4xd092T0dnQUFBQUFtQUFBQVlBSlZUZDVrTkdoZW9zTmhwdDJrUUZCMHE4M0t4NUNlU255ekxBPT0=|af89273ab50b0d8b7544726266cc2127773b9efe0e89f17ef4f7565ea938b56a; edu_user_uuid=edu-v1|867c4384-664f-4dd7-b0e3-12f39d7c831d; __zse_ck=004_hwTO2nS8T6OMRHy5yqNqX4da/ltUFNNbWAMfzR3XK/5bTQHJcPE2=PqXdV10iGWCN0sONoTBieTCTj1Pe3y77Y0GVVgHuvsDCmElWr3ATqJ/kIOWMjXC0UbSVMwau51M-nU9uyBqE4qGwsvnox8A9EzeqJoIT9QHUYpX5EKDEakqDJXWdZEVzMzrx0dPjAz0v/IC3shMEEsisjfTd+yA8BfVfwo4dI2zSYApAMxNytEw9gdvpXdUh9mX/M2Q2rgnb; tst=h; SESSIONID=b5vN9MnG4vgpyng7ffqS6YBsMBaUkMrFBd8gAO7GvrF; JOID=Ul0dAkkXTrFxcj9FIxd5q3_P6zsycHbOPEl3Jm0hPdsICFMnGd8C5xd1N0EpGVwOG1Ma7BtXlGvZJAVhCT3auVg=; osd=U1sUB0oWSLh0cT5DKhJ6qnnG7jgzdn_LP0hxL2giPN0BDVAmH9YH5BZzPkQqGFoHHlAb6hJSl2rfLQBiCDvTvFs=; BEC=e501eab8fa0f1e4eedff8088b3614a75'
};

axios.get(url, { headers })
    .then(response => {
        const $ = cheerio.load(response.data);
        const elements = $('.HotItem-img');
        elements.each((index, element) => {
            console.log($(element).attr('title'));
        });
    })
    .catch(error => {
        console.error('Error fetching the data:', error);
    });
