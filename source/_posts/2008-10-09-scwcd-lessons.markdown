---
date: '2008-10-09 05:30:45'
layout: post
comments: true
slug: scwcd-lessons
status: publish
title: Lessons learned from the SCWCD
wordpress_id: '271'
categories: java
---

Just over a week ago, I took the Sun Certified Web Component Developer (Java EE 5) exam. I'm going to share the positives and negatives of the experience so you can learn _if_ you want to take then exam, and how to go about studying.

## About the SCWCD

There are 11 main topics of the exam. I'd say they were all either very easy or quite difficult, there was very little middle ground in my opinion:

  * Servlet Technology Model
  * Structure and Deployment of Web Applications
  * The Web Container Model
  * Session Management
  * Web Application Security
  * The JavaServer Pages (JSP) Model
  * Expression Language (EL)
  * Standard Actions in JSP
  * Tag Libraries in JSP
  * Building a Custom Tag Library
  * Java EE Patterns

The newest version of the exam requires 49 of 69 correct answers (70%), and touts questions that exercise your practical ability (as opposed to your memorization) more than previous versions.

## How I studied

Unlike the SCJP, where I don't think experience was of much use, **I feel like my previous web programming experience helped out with several sections of the SCWCD.** 

I gave myself over 3 months of time to prepare for this test (as opposed to 10 days when I took the SCJP), did a lot of coding and went through most of the exercises in the [SCWCD Study Guide](http://www.amazon.com/Certified-Component-Developer-310-081-310-082/dp/0072258810/ref=pd_bbs_3?ie=UTF8&s=books&qid=1223529781&sr=8-3) I picked up. 

I also went ahead and passed all of the relevant exams I could take on [JavaBlackBelt](http://www.javablackbelt.com) and [JavaRanch](http://www.javaranch.com), and they helped to cover some things that the book did not.

## How I'd study if I had to take it again

**If I had to do it again, I'd give myself exactly one month**. 3 months is too long. Even though I did a good amount of practice, I definitely forgot some of the intricate details that might have helped me on the exam. **I would code, code, code** just like [I recommended for the SCJP](/java/how-not-to-pass-the-scjp-exam/). I took my own advice and I think it paid off.

I would still grab the [SCWCD Study Guide](http://www.amazon.com/Certified-Component-Developer-310-081-310-082/dp/0072258810/ref=pd_bbs_3?ie=UTF8&s=books&qid=1223529781&sr=8-3) as it had great examples and assignments. I found out the morning of the exam, though, that **this book is for the old version of the exam and therefore the practice questions were mostly worthless**. Luckily, the objectives are the same and obviously not all was lost.

## Most valuable things gained

I really couldn't care less about adding 5 letters to my resume, but some things did stick out as very positive gains because I took this exam. **One of the most helpful things was learning about Listeners.** I knew little about them beforehand and wasn't very comfortable with them until I wrote a bunch of them in practice. I can think of all kinds of cool refactorings to do now :)

Another key topic that I think was helpful was _Web Application Security_. I already knew a decent amount about this, but the exam really helped me fill in some gaps and gave me lots of ideas to keep things secure while being simple to maintain.

I _learned_ a lot from this experience, and that is what makes all the difference. 

## Least valuable things learned

As there is good, so shall there be bad. While I learned a lot about custom tags and JSP Documents, I felt like the questions surrounding those topics were just borderline trick questions. Don't get me wrong, I did quite well on those sections, but does there really need to be questions about whether Simple Tags can nest within Classic Tags? My argument with this is that I simply do not see enough developers using that technology, especially not enough to warrant that much attention to such a small topic. **The exam creators must make the exam about mainstream technologies** otherwise it's not useful.

One other nitpick I have about the exam (being a partial web dev myself), is that the sections on web forms seemed well... kludgy. I don't remember seeing any good practical questions about web forms on the exam, the ones I did see seemed like little caveats that I knew just because I am a web dev. **Do not take this exam so you can make a better website for your mom's friend's home business**.

## Conclusion

I'm very glad I took the SCWCD, and if you work on the Java EE stack at all I think it would be to your benefit to do the same. **Try to get your employer to pay for it**. Committing yourself to an exam gives you much more motivation to increase your skills than just studying freely. You'll be surprised at all the things you don't know and realize even more things that you wish you knew. I know I did. 

If you are planning on taking or have taken the SCWCD, please share your thoughts for everyone's benefit.
