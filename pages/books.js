import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/bookNotesPageData'
import Card from '@/components/Card'
import { PageSEO } from '@/components/SEO'

export default function BookNotes() {
  return (
    <>
      <PageSEO title={`Books - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Book Notes
          </h1>
        </div>
        <div className="container py-12">
          <div className="-m-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
