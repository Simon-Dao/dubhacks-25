import { NextResponse } from "next/server";
import { getJson } from "serpapi";
import { InlineImage, SerpApiResponse } from "@/lib/definitions";

export async function POST(request: Request) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
        return NextResponse.json({ error: "No image uploaded." }, { status: 400 });
    }

    // const imageUrl = ;
    
    // const params = {
    //   engine: "google_reverse_image",
    //   image_url: imageUrl,
    //   api_key: "35f97d443284d567b2572a7d4d20f299c01b219b1441f5d773ebca1a963f98f7",
    // };
    
    // getJson(params, (data: SerpApiResponse) => {
    //   // checks if there are any images that are returned from
    //   // the api call
    //   if (data.inline_images) {
    //     console.log("Found inline images:");
    //     data.inline_images.forEach((img, index) => {
    //       console.log(`${index + 1}. ${img.title} - ${img.link}`);
    //     });
    //   } else {
    //     console.log("No inline images found.");
    //   }
    // });


// {
//   "search_metadata": {
//     "id": "65f035c2914a81c2e52ee8e0",
//     "status": "Success",
//     "json_endpoint": "https://serpapi.com/searches/49aea29378ad12bf/65f035c2914a81c2e52ee8e0.json",
//     "created_at": "2024-03-12 11:00:18 UTC",
//     "processed_at": "2024-03-12 11:00:19 UTC",
//     "google_reverse_image_url": "https://www.google.com/searchbyimage?image_url=https://i.imgur.com/HBrB8p0.png&sbisrc=cr_1_5_2&tbs=sbi:AMhZZivdNrJkWxFQvkrYV37LPBLz7QGlPstvHdQhzCz9z2CEpEtP6wkaqUCdi5YVzv6jWhDTY5cX_1sIXrEqTlaPnT1CgRxVvrj0gm10Lr4CDl7RgCqOH4wmYb2iFrikOlw7UW5Iz8WsowfUchVVmfqDsk503zNHPIBduIh1bt0LtqvNSmoSQ2zXrFocQSuAQDFK-TpdgYaB-RhIPuq0p-GWmF8PMXjLVZeFPUErNVXPJg8DAO1YJf0Wa_176X21Jkr8gRF73U5QvqiPPoLjrRxQUwPAe3HZIpgLC1jrSnkRRHVUanGDPjrAfrxwe_1kjeMKKYs766UA_1bh0dddzdVNKucSm400-1J-cw,qdr:d",
//     "raw_html_file": "https://serpapi.com/searches/49aea29378ad12bf/65f035c2914a81c2e52ee8e0.html",
//     "total_time_taken": 1.16
//   },
//   "search_parameters": {
//     "engine": "google_reverse_image",
//     "image_url": "https://i.imgur.com/HBrB8p0.png",
//     "google_domain": "google.com",
//     "device": "desktop",
//     "tbs": "sbi:AMhZZivdNrJkWxFQvkrYV37LPBLz7QGlPstvHdQhzCz9z2CEpEtP6wkaqUCdi5YVzv6jWhDTY5cX_1sIXrEqTlaPnT1CgRxVvrj0gm10Lr4CDl7RgCqOH4wmYb2iFrikOlw7UW5Iz8WsowfUchVVmfqDsk503zNHPIBduIh1bt0LtqvNSmoSQ2zXrFocQSuAQDFK-TpdgYaB-RhIPuq0p-GWmF8PMXjLVZeFPUErNVXPJg8DAO1YJf0Wa_176X21Jkr8gRF73U5QvqiPPoLjrRxQUwPAe3HZIpgLC1jrSnkRRHVUanGDPjrAfrxwe_1kjeMKKYs766UA_1bh0dddzdVNKucSm400-1J-cw,qdr:d"
//   },
//   "search_information": {
//     "organic_results_state": "Results for exact spelling",
//     "query_displayed": "danny devito"
//   },
//   "image_results": [
//     {
//       "position": 1,
//       "title": "Arnold Schwarzenegger & Danny DeVito Still Have A Grudge ...",
//       "link": "https://www.youtube.com/watch?v=JngUruvygR0",
//       "redirect_link": "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.youtube.com/watch%3Fv%3DJngUruvygR0&ved=2ahUKEwjLsdCDye6EAxWuF1kFHbp5BqQQFnoECAkQAQ",
//       "displayed_link": "32.1K+ views · 18 hours ago",
//       "favicon": "https://serpapi.com/searches/65f035c2914a81c2e52ee8e0/images/4286e4f9c974c81240cf412503ce21f3c406e1e5a2aaea8e.png",
//       "snippet": "Arnold Schwarzenegger & Danny DeVito Still Have A Grudge Against Michael Keaton. 32K views · 18 hours ago ...more. Entertainment Tonight. 6.61M.",
//       "snippet_highlighted_words": [
//         "Danny DeVito"
//       ],
//       "source": "YouTube · Entertainment Tonight"
//     },
//     {
//       "position": 2,
//       "title": "Michael Keaton's Batman Gets Hilarious Oscar Roasting from ...",
//       "link": "https://movieweb.com/michael-keaton-batman-schwarzenegger-devito-oscar-roast/",
//       "redirect_link": "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://movieweb.com/michael-keaton-batman-schwarzenegger-devito-oscar-roast/&ved=2ahUKEwjLsdCDye6EAxWuF1kFHbp5BqQQFnoECAwQAQ",
//       "displayed_link": "https://movieweb.com › Movie News",
//       "favicon": "https://serpapi.com/searches/65f035c2914a81c2e52ee8e0/images/4286e4f9c974c812ad7d7ee3d1ea479ef8e40a24852bc785.png",
//       "date": "22 hours ago",
//       "snippet": "Arnold Schwarzenegger and Danny DeVito stole the show at the Oscars with some hilarious Batman roasting. Fans are eager for the Twins stars to reunite on ...",
//       "snippet_highlighted_words": [
//         "Danny DeVito"
//       ],
//       "source": "MovieWeb"
//     },
//   ]
// }
}


