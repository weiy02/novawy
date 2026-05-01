---
title: Git基础知识
date: 2026-04-28 21:06:11
categories:
tags:
---

# Git

```bash
git add . # 添加到暂存区

git commit
git commit -m "commit test" # 从暂存区提交到仓库

git log 

git status # 查看修改的状态
```

## 1、设置别名

```bash

```

## 2、版本回退

```bash
git reset --hard commitID

git reflog # 查看已经删除的提交记录
```

## 3、.gitignore文件

在该文件中设置不需要git进行管理的文件

```test
touch
```

## 4、Git分支常用命令

### 4.1查看本地分支

```bash
git branch # 查看分支
```

### 4.2创建本地分支

```bash
git branch 分支名 # 创建分支

git checkout 分支名 # 切换分支

git checkout -b 分支名 # 创建并切换到分支

git merge 分支名 # 合并分支

git branch -d 分支名 # 删除分支    改成大写D强制删除

git branch -a # 查看本地加上远程所有的分支
```

## 解决冲突

