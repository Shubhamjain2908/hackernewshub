# Hacker-News
Hacker-news clone is is an attempt to clone some of the functionalities of Hacker News public API i.e [Link](https://github.com/HackerNews/API).
By providing REST API endpoints in it.

The api's are written in [NodeJS](https://nodejs.org/en/).

#### Postman Collection
Link: [https://www.getpostman.com/collections/37dfb6e88c84d12417b4](https://www.getpostman.com/collections/37dfb6e88c84d12417b4)

## Installation

### Prerequisites 
a) Install Docker and Kubernetes

b) Kubernetes configured with ingress-nginx for the specific OS - 
  - Tutorial: [link](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac)

c) Adding our custom host name to the the "hosts" file of your OS. -
  - To run locally need to add the host name available in [ingress.srv.yaml](https://github.com/Shubhamjain2908/hackernewshub/blob/master/infra/k8s/ingress-srv.yaml) file to be added in the host file of a particular OS.
  - In our case map "hn-hub.dev" to "127.0.0.1". refer: [link](https://support.rackspace.com/how-to/modify-your-hosts-file/).

d) Skaffold (for feasibility & quick deployment process) - 
  - Move to the root directory of the project & run.
  - #### skaffold dev

cheers :)
Now you will see the logs of all the services running up.

You can access the API's on your local from (works only on your local system) - https://hn-hub.dev.

## API documentation

**A) Get Top Stories API (Cached) -**
```bash
URL - /top-stories (GET)
```
This API will return the list of top 10 stories (ranked by score).

**Response** - 
```json
{
    "stories": [
        {
            "comments": [
                24160344
            ],
            "isExpired": false,
            "title": "Factorio 1.0",
            "url": "https://factorio.com/blog/post/fff-360",
            "score": 1849,
            "createdAt": 1597396352,
            "user": "Akronymus",
            "storyId": 24155609,
            "id": "5f397feb2d287300934e98f1"
        },
     ]
}
```
*Cached - This API is cached for 10 minutes refresh time using bulljs as a mesasging queue service.*

**b) Get Past Stories API -**
```bash
URL - /past-stories (GET)
```
This API will returns all the past top stories that were served previously.

**Response** - 
```json
 "stories": [
        {
            "comments": [
                24160344
            ],
            "isExpired": true,
            "title": "Factorio 1.0",
            "url": "https://factorio.com/blog/post/fff-360",
            "score": 1849,
            "createdAt": 1597396352,
            "user": "Akronymus",
            "storyId": 24155609,
            "id": "5f397feb2d287300934e98f1"
        },
     ] 
 ```     
 **c) Get Top Ten Comments for a story -**
 
 This API will returns the top 10 parent comments on a given story, sorted by the total number of comments (including child comments) per thread. Each comment will have the comment's text, the user’s HN handle, and their HN age. The HN age of a user is basically how old their Hacker News profile is in years.
 
 ```bash
URL - /comments?storyId=$storyId (GET)
```
**Param** - $storyId - Story id for which comments are to retrieved.

**Response** - 
```json
 "comments": [
        {
            "id": "5f397dd91ece7b005614f5bd",
            "text": "It&#x27;s the game to teach people what technical debt and refactoring is.<p>When you start building your factory, you think about how to get first steps just done (ship it!). Over time complexity and scope of your factory increases, but old code, I mean old machines, are still there, getting in the way.<p>You can choose to ignore it and work around it using underground belts and similar solutions, or you can take on a proper refactoring, limiting your progress in the short term.",
            "username": "flixic",
            "usersAge": 50
        },
        {
            "id": "5f397dd51ece7b005614f4f8",
            "text": "It&#x27;s the game to teach people what technical debt and refactoring is.<p>When you start building your factory, you think about how to get first steps just done (ship it!). Over time complexity and scope of your factory increases, but old code, I mean old machines, are still there, getting in the way.<p>You can choose to ignore it and work around it using underground belts and similar solutions, or you can take on a proper refactoring, limiting your progress in the short term.",
            "username": "flixic",
            "usersAge": 50
        }
     ] 
 ```     
 
 ## Troubleshooting
While running the services you might find then there are some services which are failing to start or sending an error for TCP connection. 
It happens when one of the dependent deployment finishes early then the other one, In that case you need to restart the pod, run: ```kubectl get pods``` (to get the pods name) & then to restart the depl just delete that pod with ```kubectl delete POD_NAME```
