export type TranslationKey =
  | "nav.glasses"
  | "nav.sunglasses"
  | "nav.eyeExam"
  | "nav.signIn"
  | "nav.signOut"
  | "nav.cart"
  | "auth.signInTitle"
  | "auth.signUpTitle"
  | "auth.continuing"
  | "auth.createAccount"
  | "home.hero.tagline"
  | "home.hero.title"
  | "home.hero.titleHighlight"
  | "home.hero.description"
  | "home.hero.shopGlasses"
  | "home.hero.shopSunglasses"
  | "home.hero.freeCheckup"
  | "home.hero.bookAppointment"
  | "home.offers.title"
  | "home.offers.promotion.title"
  | "home.offers.promotion.heading"
  | "home.offers.promotion.description"
  | "home.offers.promotion.cta"
  | "home.offers.kids.title"
  | "home.offers.kids.heading"
  | "home.offers.kids.description"
  | "home.offers.kids.cta"
  | "home.offers.blueLight.title"
  | "home.offers.blueLight.heading"
  | "home.offers.blueLight.description"
  | "home.offers.blueLight.cta"
  | "home.categories.title"
  | "home.categories.glasses.title"
  | "home.categories.glasses.heading"
  | "home.categories.glasses.description"
  | "home.categories.glasses.cta"
  | "home.categories.sunglasses.title"
  | "home.categories.sunglasses.heading"
  | "home.categories.sunglasses.description"
  | "home.categories.sunglasses.cta"
  | "home.categories.eyeCare.title"
  | "home.categories.eyeCare.heading"
  | "home.categories.eyeCare.description"
  | "home.categories.eyeCare.cta"
  | "footer.shopName"
  | "footer.tagline"
  | "footer.contact"
  | "footer.phone"
  | "catalog.noResults"
  | "catalog.loading"
  | "catalog.error"
  | "catalog.filters"
  | "product.addToCart"
  | "product.notFound"
  | "product.loading"
  | "product.error"
  | "cart.title"
  | "cart.empty"
  | "cart.emptyDescription"
  | "cart.browseGlasses"
  | "cart.browseSunglasses"
  | "cart.proceedToCheckout"
  | "cart.orderSummary"
  | "cart.subtotal"
  | "cart.shipping"
  | "cart.total"
  | "cart.remove"
  | "checkout.title"
  | "checkout.emptyCart"
  | "checkout.step1"
  | "checkout.step2"
  | "checkout.step3"
  | "checkout.contactDetails"
  | "checkout.delivery"
  | "checkout.payment"
  | "checkout.placeOrder"
  | "checkout.back"
  | "checkout.next"
  | "auth.signIn"
  | "auth.signUp"
  | "auth.email"
  | "auth.password"
  | "auth.name"
  | "auth.rememberMe"
  | "auth.forgotPassword"
  | "auth.submit"
  | "exam.title"
  | "exam.form.name"
  | "exam.form.email"
  | "exam.form.phone"
  | "exam.form.store"
  | "exam.form.date"
  | "exam.form.time"
  | "exam.form.notes"
  | "exam.form.consent"
  | "exam.form.submit"
  | "exam.success"
  | "exam.error"
  | "admin.title"
  | "admin.products"
  | "admin.orders"
  | "admin.content"
  | "notFound.title"
  | "notFound.description"
  | "notFound.goHome"
  | "notFound.browseGlasses";

export const translations: Record<
  "en" | "sq",
  Record<TranslationKey, string>
> = {
  en: {
    "nav.glasses": "Glasses",
    "nav.sunglasses": "Sunglasses",
    "nav.eyeExam": "Eye exam",
    "nav.signIn": "Sign in",
    "nav.signOut": "Sign out",
    "nav.cart": "Cart",
    "home.hero.tagline": "Premium eyewear & eye care",
    "home.hero.title": "Discover your perfect",
    "home.hero.titleHighlight": "pair of glasses",
    "home.hero.description":
      "Explore a curated collection of prescription glasses and sunglasses from leading brands, with professional eye care services in-store.",
    "home.hero.shopGlasses": "Shop glasses",
    "home.hero.shopSunglasses": "Shop sunglasses",
    "home.hero.freeCheckup": "Free eye check-up",
    "home.hero.bookAppointment": "Book your appointment in minutes.",
    "home.offers.title": "Current offers & services",
    "home.offers.promotion.title": "Promotion",
    "home.offers.promotion.heading": "2nd pair of glasses at -50%",
    "home.offers.promotion.description":
      "Buy a complete pair (frame + lenses) and get the second pair at half price for you or a family member.",
    "home.offers.promotion.cta": "Ask in store for details →",
    "home.offers.kids.title": "Kids eyewear",
    "home.offers.kids.heading": "Special packages for children",
    "home.offers.kids.description":
      "Lightweight, impact‑resistant frames and lenses designed for everyday use at school and sports.",
    "home.offers.kids.cta": "Discover kids collection →",
    "home.offers.blueLight.title": "Blue light protection",
    "home.offers.blueLight.heading": "Lenses for work & screens",
    "home.offers.blueLight.description":
      "Reduce eye strain with lenses optimized for long hours in front of digital devices.",
    "home.offers.blueLight.cta": "Add blue‑light filter to your order →",
    "home.categories.title": "Featured categories",
    "home.categories.glasses.title": "Glasses",
    "home.categories.glasses.heading": "Everyday prescription glasses",
    "home.categories.glasses.description":
      "Classic, modern and minimal frames designed for daily comfort.",
    "home.categories.glasses.cta": "Browse collection →",
    "home.categories.sunglasses.title": "Sunglasses",
    "home.categories.sunglasses.heading": "Sun protection with style",
    "home.categories.sunglasses.description":
      "Polarized and UV-protective sunglasses for every season.",
    "home.categories.sunglasses.cta": "View sunglasses →",
    "home.categories.eyeCare.title": "Eye care",
    "home.categories.eyeCare.heading": "Professional eye exam services",
    "home.categories.eyeCare.description":
      "Get a comprehensive eye check-up with our certified optometrists.",
    "home.categories.eyeCare.cta": "Book an exam",
    "footer.shopName": "Prime Optic",
    "footer.tagline": "High-quality prescription glasses and sunglasses.",
    "footer.contact": "Contact: info@example.com",
    "footer.phone": "Phone: +000 000 000",
    "catalog.noResults": "No products found",
    "catalog.loading": "Loading products...",
    "catalog.error": "Failed to load products",
    "catalog.filters": "Filters",
    "product.addToCart": "Add to cart",
    "product.notFound": "Product not found",
    "product.loading": "Loading product...",
    "product.error": "Failed to load product",
    "cart.title": "Shopping cart",
    "cart.empty": "Your cart is empty",
    "cart.emptyDescription":
      "Add some products to your cart to continue shopping.",
    "cart.browseGlasses": "Browse glasses",
    "cart.browseSunglasses": "Browse sunglasses",
    "cart.proceedToCheckout": "Proceed to checkout",
    "cart.orderSummary": "Order summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping calculated at checkout",
    "cart.total": "Total",
    "cart.remove": "Remove",
    "checkout.title": "Checkout",
    "checkout.emptyCart": "No items to checkout",
    "checkout.step1": "Contact details",
    "checkout.step2": "Delivery",
    "checkout.step3": "Payment",
    "checkout.contactDetails": "Contact details",
    "checkout.delivery": "Delivery",
    "checkout.payment": "Payment",
    "checkout.placeOrder": "Place order (demo)",
    "checkout.back": "Back",
    "checkout.next": "Next",
    "auth.signIn": "Sign in",
    "auth.signUp": "Sign up",
    "auth.signInTitle": "Sign in to your account",
    "auth.signUpTitle": "Create an account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full name",
    "auth.rememberMe": "Remember me",
    "auth.forgotPassword": "Forgot password?",
    "auth.submit": "Submit",
    "auth.continuing": "Continuing...",
    "auth.createAccount": "Create account",
    "exam.title": "Book an eye exam",
    "exam.form.name": "Full name",
    "exam.form.email": "Email address",
    "exam.form.phone": "Phone number",
    "exam.form.store": "Preferred store location",
    "exam.form.date": "Preferred date",
    "exam.form.time": "Preferred time",
    "exam.form.notes": "Additional notes (optional)",
    "exam.form.consent": "I agree to the terms and conditions",
    "exam.form.submit": "Book appointment",
    "exam.success": "Appointment booked successfully!",
    "exam.error": "Failed to book appointment",
    "admin.title": "Admin dashboard",
    "admin.products": "Products",
    "admin.orders": "Orders",
    "admin.content": "Content",
    "notFound.title": "Page not found",
    "notFound.description": "The page you're looking for doesn't exist.",
    "notFound.goHome": "Go to homepage",
    "notFound.browseGlasses": "Browse glasses",
  },
  sq: {
    "nav.glasses": "Syze",
    "nav.sunglasses": "Syze dielli",
    "nav.eyeExam": "Kontroll i syrit",
    "nav.signIn": "Hyr",
    "nav.signOut": "Dil",
    "nav.cart": "Shporta",
    "home.hero.tagline": "Syze premium dhe kujdes për sy",
    "home.hero.title": "Zbuloni çiftin tuaj të përsosur",
    "home.hero.titleHighlight": "syze",
    "home.hero.description":
      "Eksploroni një koleksion të kuruar syzash me recetë dhe syzash dielli nga markat kryesore, me shërbime profesionale kujdesi për sy në dyqan.",
    "home.hero.shopGlasses": "Bli syze",
    "home.hero.shopSunglasses": "Bli syze dielli",
    "home.hero.freeCheckup": "Kontroll falas i syrit",
    "home.hero.bookAppointment": "Rezervoni takimin tuaj në minuta.",
    "home.offers.title": "Ofertat dhe shërbimet aktuale",
    "home.offers.promotion.title": "Promocion",
    "home.offers.promotion.heading": "Çifti i 2-të i syzave me -50%",
    "home.offers.promotion.description":
      "Bli një çift të plotë (kornizë + lente) dhe merr çiftin e dytë me gjysmë çmimi për ty ose një anëtar familjeje.",
    "home.offers.promotion.cta": "Pyet në dyqan për detaje →",
    "home.offers.kids.title": "Syze për fëmijë",
    "home.offers.kids.heading": "Paketa speciale për fëmijë",
    "home.offers.kids.description":
      "Korniza dhe lente të lehta, rezistente ndaj goditjeve, të projektuara për përdorim të përditshëm në shkollë dhe sport.",
    "home.offers.kids.cta": "Zbulo koleksionin për fëmijë →",
    "home.offers.blueLight.title": "Mbrojtje nga drita blu",
    "home.offers.blueLight.heading": "Lente për punë dhe ekrane",
    "home.offers.blueLight.description":
      "Redukton lodhjen e syve me lente të optimizuara për orë të gjata para pajisjeve dixhitale.",
    "home.offers.blueLight.cta": "Shto filtër dritë blu në porosinë tënde →",
    "home.categories.title": "Kategoritë e rekomanduara",
    "home.categories.glasses.title": "Syze",
    "home.categories.glasses.heading": "Syze me recetë të përditshme",
    "home.categories.glasses.description":
      "Korniza klasike, moderne dhe minimale të projektuara për rehati të përditshme.",
    "home.categories.glasses.cta": "Shfletoni koleksionin →",
    "home.categories.sunglasses.title": "Syze dielli",
    "home.categories.sunglasses.heading": "Mbrojtje nga dielli me stil",
    "home.categories.sunglasses.description":
      "Syze dielli të polarizuara dhe mbrojtëse nga UV për çdo stinë.",
    "home.categories.sunglasses.cta": "Shiko syzet dielli →",
    "home.categories.eyeCare.title": "Kujdes për sy",
    "home.categories.eyeCare.heading":
      "Shërbime profesionale kontrolli i syrit",
    "home.categories.eyeCare.description":
      "Merrni një kontroll të plotë të syrit me optometristët tanë të certifikuar.",
    "home.categories.eyeCare.cta": "Rezervo një kontroll",
    "footer.shopName": "Prime Optic",
    "footer.tagline": "Syze me recetë dhe syze dielli me cilësi të lartë.",
    "footer.contact": "Kontakt: info@example.com",
    "footer.phone": "Telefon: +000 000 000",
    "catalog.noResults": "Nuk u gjetën produkte",
    "catalog.loading": "Duke ngarkuar produktet...",
    "catalog.error": "Dështoi ngarkimi i produkteve",
    "catalog.filters": "Filtrat",
    "product.addToCart": "Shto në shportë",
    "product.notFound": "Produkti nuk u gjet",
    "product.loading": "Duke ngarkuar produktin...",
    "product.error": "Dështoi ngarkimi i produktit",
    "cart.title": "Shporta e blerjeve",
    "cart.empty": "Shporta juaj është e zbrazët",
    "cart.emptyDescription":
      "Shtoni disa produkte në shportën tuaj për të vazhduar blerjet.",
    "cart.browseGlasses": "Shfletoni syze",
    "cart.browseSunglasses": "Shfletoni syze dielli",
    "cart.proceedToCheckout": "Vazhdo te pagesa",
    "cart.orderSummary": "Përmbledhje porosie",
    "cart.subtotal": "Nëntotali",
    "cart.shipping": "Transporti llogaritet në pagesë",
    "cart.total": "Totali",
    "cart.remove": "Hiq",
    "checkout.title": "Pagesa",
    "checkout.emptyCart": "Nuk ka artikuj për pagesë",
    "checkout.step1": "Detajet e kontaktit",
    "checkout.step2": "Dorëzimi",
    "checkout.step3": "Pagesa",
    "checkout.contactDetails": "Detajet e kontaktit",
    "checkout.delivery": "Dorëzimi",
    "checkout.payment": "Pagesa",
    "checkout.placeOrder": "Bëj porosinë (demo)",
    "checkout.back": "Mbrapa",
    "checkout.next": "Tjetër",
    "auth.signIn": "Hyr",
    "auth.signUp": "Regjistrohu",
    "auth.signInTitle": "Hyr në llogarinë tënde",
    "auth.signUpTitle": "Krijo një llogari",
    "auth.email": "Email",
    "auth.password": "Fjalëkalimi",
    "auth.name": "Emri i plotë",
    "auth.rememberMe": "Më mbaj mend",
    "auth.forgotPassword": "Harrove fjalëkalimin?",
    "auth.submit": "Dërgo",
    "auth.continuing": "Duke vazhduar...",
    "auth.createAccount": "Krijo llogari",
    "exam.title": "Rezervo një kontroll të syrit",
    "exam.form.name": "Emri i plotë",
    "exam.form.email": "Adresa e emailit",
    "exam.form.phone": "Numri i telefonit",
    "exam.form.store": "Vendndodhja e preferuar e dyqanit",
    "exam.form.date": "Data e preferuar",
    "exam.form.time": "Koha e preferuar",
    "exam.form.notes": "Shënime shtesë (opsionale)",
    "exam.form.consent": "Pranoj kushtet dhe termat",
    "exam.form.submit": "Rezervo takimin",
    "exam.success": "Takimi u rezervua me sukses!",
    "exam.error": "Dështoi rezervimi i takimit",
    "admin.title": "Paneli i administratorit",
    "admin.products": "Produktet",
    "admin.orders": "Porositë",
    "admin.content": "Përmbajtja",
    "notFound.title": "Faqja nuk u gjet",
    "notFound.description": "Faqja që po kërkoni nuk ekziston.",
    "notFound.goHome": "Shko te faqja kryesore",
    "notFound.browseGlasses": "Shfletoni syze",
  },
};
