# 🎄 Holiday Helper

A beautiful, lightweight, and phone-friendly **Blazor WebAssembly PWA** designed to make holiday organization simple and fun.

## 🎯 Project Goal
The goal of this project is to provide a collection of holiday-themed utilities that work offline and respect user privacy. By leveraging **Progressive Web App (PWA)** technology, the app feels like a native mobile app and can be pinned to the home screen for easy access during the holidays.

## 🎁 Use Case: Secret Santa Generator
The flagship feature is a **"Pass the Phone" Secret Santa Generator**.

- **Scenario**: You are at a family gathering or a dinner with friends.
- **Workflow**: 
  1. Add all participants' names.
  2. Set exclusions (e.g., spouses shouldn't pick each other).
  3. Generate assignments.
  4. **Pass the Phone**: Each person takes the phone, clicks "Reveal", sees their assignment in private, clicks "I've seen it", and passes it to the next person.
- **Privacy**: No accounts, no emails, and no back-end. All data is stored locally in the browser's storage, ensuring that your gift exchange stays private to your group.

## 🛠 Tech Stack
- **Framework**: [.NET 10 Blazor WebAssembly](https://learn.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-10.0)
- **UI Library**: [MudBlazor](https://mudblazor.com/) for a premium, responsive Material Design experience.
- **Persistence**: Browser Local Storage for persistent state without a database.
- **Deployment**: Optimized for static hosting (GitHub Pages, Static Web Apps).

## 🚀 Getting Started locally
1. Clone the repository.
2. Ensure you have the .NET 10 SDK installed.
3. Run `dotnet watch run` to start the development server.
4. Open the app in your browser and start organizing!

## ☁️ Publishing to Cloudflare Pages
This project is pre-configured for Cloudflare Pages handling via the `_redirects` file in `wwwroot` for SPA routing.
1. Push this repository to GitHub or GitLab.
2. In the Cloudflare Dashboard, create a new **Pages** project from your Git repository.
3. Use the following build settings:
   - **Framework preset**: None
   - **Build command**: `curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin -c 10.0 && export PATH="$HOME/.dotnet:$PATH" && dotnet publish ChristmasApp.csproj -c Release -o output`
   - **Build output directory**: `output/wwwroot`
