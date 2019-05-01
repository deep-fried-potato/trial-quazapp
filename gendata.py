import requests
import json
import random

tokens = []

def gendata(start, end):
  for i in range(start, end):
    response = requests.post(
        'http://localhost:8000/api/auth/register',
        data = {
          "name": "student" + str(i),
          "email": "student" + str(i) + "@asd.com",
          "age": "20",
          "password": "asdasd",
          "username": "student" + str(i),
          "isTeacher": False
        }
    )

    tokens.append(response.json()['token'])

  print(tokens)

def readtokens():
  with open('tokens.txt') as f:
    for line in f:
      tokens.append(line.rstrip())

def joincourse(course=1):
  for t in tokens:
    response = requests.post(
      'http://localhost:8000/course/joincourse',
      data = {
        "joinKey": "8ce40728a5d2889616981af61efd88da"
      },
      headers={
        'x-access-token': t
      }
    )

    print(response.json())

t_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU2NjkzODM1LCJleHAiOjE1NTY3ODAyMzV9.4d2eHyMwEMVn4ScoyDZW_Ft0Emlx7kQmYd8M16j5Its"
def createquiz(course=1, token=t_token, qname="DBMS_ENDSEM"):
  response = requests.post(
    "http://localhost:8000/quiz/createquiz",
    headers={'x-access-token': token},
    data=json.loads("""
      {
        "accesskey":"DBMS",
        "quizname":"DBMS ENDSEM",
        "qdata":[
            {
              "questiontext":"What is a lock"	,
              "options":["a physical lock","not a lock","database lock","data protector"]
            },
            {
              "questiontext":"What is UML"	,
              "options":["Universal media lang","University of Mary Land","Unified modeling language","Language of the Model of the Universe"]
            },
            {
              "questiontext":"What is DB"	,
              "options":["Database","Double Bass","Dirty Bat","Donald Brump"]
            },
            {
              "questiontext":"Why is DB"	,
              "options":["yes","no","all of the above","yes"]
            },
            {
              "questiontext":"Why is DB"	,
              "options":["yes","no","all of the above","yes"]
            },
            {
              "questiontext":"Why is DB"	,
              "options":["yes","no","all of the above","yes"]
            },
            {
              "questiontext":"Why is DB"	,
              "options":["yes","no","all of the above","yes"]
            },
            {
              "questiontext":"Why is DB"	,
              "options":["yes","no","all of the above","yes"]
            },
            {
              "questiontext":"Why is DB"	,
              "options":["yes","no","all of the above","yes"]
            },
            {
              "questiontext":"Why is DB"	,
              "options":["yes","no","all of the above","yes"]
            }
          ],
        "answers":[2,2,1,4,1,2,3,3,1,4,4],	
        "coursecid":1,	
        "starttime":"2019-05-01T16:40:00.782Z",
        "endtime":"2019-05-01T16:40:40.782Z"
      }""")
  )

  print(response.json())
  return response.json()[0]['quizid']

def startquiz(qid):
  for t in tokens:
    reponse = requests.post(
      'http://localhost:8000/quiz/startquiz',
      headers = {
        'x-access-token': t
      },
      data={'accesskey': 'DBMS', 'quizid': qid}
    )
answers = [2,2,1,4,1,2,3,3,1,4,4]
def randomresponses(quiz):
  for t in tokens:
    intelligence = random.randint(1,10)
    for i in range(10):
      response = requests.post(
        'http://localhost:8000/quiz/sendAnswer',
        data={'quizid':quiz, 'question': i, 'answer': answers[i] if random.randint(1,intelligence) >= 5 else random.randint(1, 4)},
        headers={'x-access-token': t}
      )


readtokens()
id = createquiz()
startquiz(id)
randomresponses(id)

