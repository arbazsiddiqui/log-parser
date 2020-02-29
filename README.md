# log-parser

### Getting Started

1. Perform a clone of this repo `git clone https://github.com/arbazsiddiqui/log-parser`
2. Install the required packages `nvm use && npm install`.
3. Change the value in config.json to your desired log file.
4. Run the server `npm start`.
5. Open `http://localhost:8080/log`
6. To run tests use `npm t`


### API

## /log
Api to fetch logs using query params like timstamp, status code etc.

* **URL**

  /log?timestampFrom={timestampFrom}&timestampTo={timestampTo}&status={statusCode}&route={route}&ip={ip}

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Optional:**
 
   `timestampFrom=string]`
   Start time of logs to parse in ISO 8601 format. Example : 2020-01-01T00:00:00.182Z
   
   `timestampTo=string`
   End time of logs to parse in ISO 8601 format. Example : 2020-01-01T00:00:00.182Z
   
   `status=integer`
   Status code of the logs to fetch. Example : 200
   
   `route=string`
   Route of the logs to fetch without backslashes. Example : home
   
   `ip=string`
   IP of the logs to fetch. Example : 183.187.104.41

* **Success Response:**
  
  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  * **Code:** 200 <br />
    **Content:** `[ 2020-01-02T00:06:33.312Z Request received from 111.94.139.169 for /projects ]`
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ "message": "Something went wrong" }`
    
* **Sample Curl:**
    ```
    curl --location --request GET 'http://localhost:8080/log?timestampFrom=2020-01-01T00:00:00.182Z&timestampTo=2020-01-02T00:00:00.000Z&status=200&route=projects&ip=183.187.104.41' \--data-raw ''
