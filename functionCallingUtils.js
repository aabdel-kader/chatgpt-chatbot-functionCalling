import axios from 'axios';

// The tools object that will be passed to the openAI request
export const tools = [
    {
        type: "function",
        function:
            {
                name:"lookUpTime",
                description: "Get the current time in a given location",
                parameters: {
                    type: "object",
                    properties: {
                        location: {
                        type: "string",
                        description: "The location, e.g. San Francisco, CA. but it should be written in a timezone name like Asia/Shangh",
                      }
                    },
                    required: ["location"]
                }
            }
        
    }]

// custom function used to lookup the current time in a given country
export async function lookUpTime(locaion){
    const response = await axios.get('http://worldtimeapi.org/api/timezone/'+locaion);

    // const {datetime} = response.data.datetime;
    
    // console.log(response.data.datetime)
    return "The time in"+locaion+response.data.datetime


}

