import requests
import json
import random
import time

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
        "quizname":""" + f"\"{qname}\"" + """,
        "qdata":[
            {
              "questiontext":"""+ f"\"{qname}" + """Question 1",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 2",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 3",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 4",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 5",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 6",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 7",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 8",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 9",
              "options":["Option1","Option2","Option3","Option4"]
            },
            {
              "questiontext":"""+ f"\"{qname}" + """Question 10",
              "options":["Option1","Option2","Option3","Option4"]
            }
          ],
        "answers":[2,2,1,4,1,2,3,3,1,4,4],	
        "coursecid":1,	
        "starttime":"2019-05-01T20:43:00.782Z",
        "endtime":"2019-05-01T20:50:50.782Z"
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

quizids = []

readtokens()
for i in range(10):
  quizids.append(createquiz(qname="Quiz"+str(i)))

time.sleep(60)

for q in quizids:
  startquiz(q)
  randomresponses(q)

