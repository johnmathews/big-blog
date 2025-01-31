import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/photographsPageData'
import PhotoCard from '@/components/PhotoCard'
import { PageSEO } from '@/components/SEO'

export default function Photographs() {
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Photographs
          </h1>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d, index) => (
              <PhotoCard
                key={d.title}
                title={d.title}
                imgSrc={d.imgSrc}
                href={d.href}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
