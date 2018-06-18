const axios = require('axios');
require('dotenv').config();

const urlEndpoint = "https://api.github.com/search/issues?q=" +
  "type:pr" + `+author:${process.env.USERNAME}` + "+org:WeTrustPlatform" + `+created:${process.argv[2]}`;

// Customize processing here
const processData = function(items) {
  const result = {};
  let i;
  for (i = 0; i < items.length; i++) {
    let html_url = items[i].html_url;
    let [_, repo, pullNumber] = html_url.match(/WeTrustPlatform\/(.*)\/pull\/(.*)/);

    if (!result.hasOwnProperty(repo)) {
      result[repo] = [pullNumber] ;
    } else {
      result[repo].push(pullNumber);
    }
  }

  // Customize standout here
  for (let repo in result) {
    console.log(repo + ": " + result[repo].map(pullNumber => `PR#${pullNumber}`).join(', '));
  }
};

axios.get(urlEndpoint, {
    headers: {
      'X-GitHub-OTP': `${process.argv[3]}`,
      'Authorization': "Basic " + new Buffer(process.env.USERNAME + ":" + process.env.PASSWORD).toString('base64'),
      'responseType': 'json'
    }
  }
).then(function(response) {
  processData(response.data.items);
}).catch(function(error) {
  console.log(error);
});
