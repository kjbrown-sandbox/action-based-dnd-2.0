This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-  [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-  [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# A custom-first, action-centered character sheet

This is an interactive character sheet built for Dungeons and Dragons. The goal was to make something easy to use, as automatic as possible, and still give you the flexibility you need for anything homebrew or outside the ordinary.

## To do:

-  [x] Can add multiple characters
-  [x] Attributes
-  [x] Skills
   -  [x] Half proficient, full proficient, double proficient
-  [ ] Inventory - add items
   -  [ ] Need to show up somewhere in actions list
   -  [ ] Would be nice if they could store charges and amount
   -  [ ] Special option for weapons, can add more fields
-  [x] Spells
-  [ ] Add "events" - short/long rest that gives HP, hit dice, refills charges/spells, etc.
-  [ ] At least one place to put notes/descriptions/thoughts
-  [ ] Money
-  [x] Skill rows/skills could use some refactoring. There's some gross repeated logic

---

-  [ ] Add ability to say "+cha" or "+prof" to smart input boxes to add that
-  [ ] Fix Autocomplete UI
   -  [ ] Darken the colors
   -  [ ] Fix the round borders not showing up?
-  [ ] Remove all errors/warnings

--
V2

-  [ ] Spell tab for unprepared spells?
-  [ ] Clicking on stuff lets you roll dice
   -  [ ] Abilities
   -  [ ] Skills
   -  [ ] Actions
   -  [ ] Items
   -  [ ] Spells
-  [ ] Potentially rename "trigger" to something else
-  [ ] Attacks/spells need to be connected to ability scores

## Cursed learnings:

-  2025.04.04 - console.log does not print the value of the variable at the exact moment it's called. Something about the event loop or something waits until it gets a chance to print--but if the variable is an object whose fields are modified before the printing occurs, console.log shows the NEW value of the object, not what it was at the time it was called.
