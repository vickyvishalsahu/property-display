import { cn } from '@/domains/shared/utils/cn'

type Props = {
  classNameList: string | string[]
}

export const SkeletonLoading = ({ classNameList }: Props) => {
  const baseClass = 'animate-pulse bg-gray-200 rounded-md'

  const renderSingle = (className: string, key?: string | number) => (
    <div key={key} className={cn(baseClass, className)} />
  )

  if (!Array.isArray(classNameList)) return renderSingle(classNameList)

  return <>{classNameList.map((className, index) => renderSingle(className, className + index))}</>
}
