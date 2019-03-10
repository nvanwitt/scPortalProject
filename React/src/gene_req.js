function search(cb) {
  return fetch(`/api/data`, {
    accept: "application/json"
  })
  .then(checkStatus)
  .then(response => response.json())
  .then(function(response) {
    console.log(response)
    return response;
  })
  .then(cb);


}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const GeneReq = { search };
export default GeneReq;
  