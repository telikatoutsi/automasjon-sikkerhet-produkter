# Automasjon & Sikkerhet — produktside

Modernisert produktkatalog for [Automasjon & Sikkerhet AS](https://automasjonsikkerhet.no) — maskinsikkerhet fra ABB Jokab Safety, Troax, Inxpect, Nordic Door og IDEC.

Ren statisk side: ingen byggesteg, ingen avhengigheter. Fonter (Oswald + Barlow) er selv-hostet.

## Struktur

```
index.html        Siden
css/styles.css    Design-tokens + all styling
js/products.js    Produktdata — rediger her for å legge til/endre produkter
js/app.js         Søk, kategorifilter, mobilmeny
fonts/            Oswald + Barlow (woff2)
images/           Produktbilder (settes via `img` i products.js)
```

## Kjør lokalt

```bash
python3 -m http.server 8080
```

Åpne <http://localhost:8080>.

## Legg til et produkt

Legg til et objekt i `js/products.js`:

```js
{ name: "Produktnavn", code: "KODE", brand: "ABB", cat: "Sikkerhetsstyring",
  href: "https://…", desc: "Kort beskrivelse.",
  doc: "Brosjyre", docHref: "https://…" }   // doc/docHref er valgfrie
```

`cat` må være en av kategoriene i `AS_CATEGORIES`.

## Publisering

Siden publiseres automatisk med GitHub Pages fra `main`.
