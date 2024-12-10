# JS Code Test

This code test will determine your approach on solving problems.

You will be using SpaceX API. <https://docs.spacexdata.com>

Your app should only utilize `https://api.spacexdata.com/v3/launches` endpoint.

---

What the app should do:

- Display a loading component.
- Fetch data from the provided api.
- Apply infinite scrolling.
- Display fetched data in a scrollable view that lazy loads more data when scrolled down.
- Display loading component at the bottom of the list on every lazy load.
- Show message when no more data fetched.
- Integrate basic search feature.

---

## Important

- The above features will be the whole basis of your evaluation. If you were able to finish everything, you can then add more features to the application.
- Implement your own infinite scroll feature.

### Notes

- Feel free to show off more of your skillset. You can use state management libraries, react-router and other libraries that you are comfortable using.
- You can add different transitions.

## Dev Notes

1. Used Tailwind CSS instead of SASS because Tailwind speeds up the development process with utility-first classes. It also integrates nicely with modern frameworks.

2. Used Vite + React instead of a standard Create React App setup because Vite provides a faster and more modern development environment, improved bundling performance, and an overall smoother developer experience.

3. Did not use any other state management tool (like Redux or Zustand) as this is a single-page application with a relatively simple state. For more complex scenarios, introducing a state management library would make sense.

4. Leveraged the native `IntersectionObserver` API for my own infinite scrolling but will use dependencies for real-life applications for easier implementations.

5. Implemented a client-side filter (search) to filter the displayed data based on `mission_name`. If server-side filtering becomes possible, the approach can be adjusted accordingly.
