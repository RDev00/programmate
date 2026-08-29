import Link from "next/link";

type Item = {
  name: string;
  link: string;
}

function List(
  { items, name }: { items: Item [], name: string },
) {
  return (
    <ul
      className="flex flex-col gap-2 items-center justify-center w-40 text-sm text-start">
      <p
        className="font-medium w-full">
        {name}
      </p>
      {items.map((item, i) =>
        <li key={i}
          className="w-full">
          <Link
            href={item.link}
            className="w-full opacity-60 hover:opacity-100 hover:text-accent">
            {item.name}
          </Link>
        </li>
      )}
    </ul>
  )
}

export default function Footer() {
  const lists = [
    {
      name: "About",
      items: [
        { name: "Home", link: "/" },
        { name: "Pricing", link: "/pricing" },
        { name: "Product", link: "/product" },
        { name: "Our mission", link: "/us/mission" },
      ]
    },
    {
      name: "Docs",
      items: [
        { name: "Github", link: "/" },
        { name: "Insiders", link: "/insiders" },
        { name: "Architecture", link: "/insiders/arch" },
        { name: "Stack", link: "/insiders/stack" },
      ]
    }
  ]

  return (
    <footer
    className="w-full p-4 bg-neutral-950 flex flex-col md:flex-row gap-2 items-center justify-center">
      <div
      className="w-full flex flex-col md:flex-row gap-4 items-start justify-start px-10">
        {
          lists.map((list, i) => <List key={i} name={list.name} items={list.items} /> )
        }
      </div>
    </footer>
  )
}
