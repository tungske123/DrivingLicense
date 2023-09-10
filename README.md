# How to use Github

- git add `file` -> git add index.html
- git add .-> push all codes to stage changes
- git commit -m 'message' -> git commit -m 'Add index.html and style.css'
- git push: git push --set-upstream origin optimize-ui
- branch
- branch-name: feat/add-header, optimize-ui, quick-fix
- git checkout -b `branch` -> git checkout -b optimize-ui
- if branch does not exist under local, the source control ui will have the public
- create pull request
- merge code to branch master
- git pull: pull code from github
- Delete branch: git branch -D (name of branch)

# Quy trình up code:

Bước 1: Clone project về máy:
Navigate tới ổ đĩa mình muốn sau đó dùng lệnh sau:

`git clone https://github.com/MinhTranTuan3112/DrivingLicense_Group3.git`

Rồi chuyển sang nhánh main: `git checkout main`

Bước 2: pull code từ nhánh main: `git pull`

Bước 3: Tạo branch theo tên mình muốn: `git branch <tên nhánh>`

Bước 4: git add . -> `git commit -m '(Message update cái gì)'`

Bước 5: Push code lên: `git push`

Bước 6: Lên github tạo pull request chờ merge code

# DrivingLicense_Group3
A website aiming to help passing the driving license test 

## Relational Schema: 
https://drawsql.app/teams/myteam-595/diagrams/driving-license
