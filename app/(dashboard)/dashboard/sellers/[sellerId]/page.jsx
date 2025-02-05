import { SellerForm } from "../components/SellerForm";

export async function addSellerToDatabase(data) {
  // Create a FormData object
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  // Send the data to the Next.js API route
  const response = await fetch("/api/sellers", {
    method: "POST",
    body: formData,
  });

  // Handle errors
  if (!response.ok) {
    throw new Error("Failed to add seller");
  }

  return response.json();
}

const SellerDetailClient = async ({ params }) => {
  const sellerId = (await params).sellerId;
  console.log(sellerId);
  try {
    const [countryRes, industryRes, designationRes] = await Promise.all([
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry"),
      fetch(
        "https://tradetoppers.esoftideas.com/esi-api/responses/designation"
      ),
    ]);

    // Check if responses are OK
    if (!countryRes.ok || !industryRes.ok || !designationRes.ok) {
      throw new Error("One or more API requests failed");
    }

    // Log the raw responses to debug
    const countryText = await countryRes.text();
    const industryText = await industryRes.text();
    const designationText = await designationRes.text();

    // console.log("Country Response:", countryText);
    // console.log("Industry Response:", industryText);
    // console.log("Designation Response:", designationText);

    // Parse the JSON data.
    const countriesData = JSON.parse(countryText);
    const industriesData = JSON.parse(industryText);
    const designationsData = JSON.parse(designationText);


    // Extract the arrays (adjust the property names if necessary).
    const countries = countriesData?.Country || [];
    const industries = industriesData?.Industry || [];
    const designations = designationsData?.Designations || [];
  
    // Create an array of country codes by mapping over the countries array.
    const countryCodes = countries.map((item) => item.code);

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">
          {sellerId === "new" ? "Add New Seller" : "Edit Seller"}
        </h1>
        <SellerForm
          countries={countries}
          industries={industries}
          countrycodes={countryCodes}
          designations={designations}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Failed to load seller data. Please try again.</div>;
  }
};

export default SellerDetailClient;
