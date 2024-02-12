import React from 'react'
import chicletsStyle from './hello.module.css'
import picSrc from '../img/Apple.avif'

export default function Chiclets() {

   return (
      <div className={chicletsStyle.chiclets}>

         <picture className={chicletsStyle['chiclets-item-01-1']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-02-1']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-02-2']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-03-1']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-03-2']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-03-3']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-04-1']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-04-2']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-04-3']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>
         <picture className={chicletsStyle['chiclets-item-04-4']}>
            <source srcSet={picSrc} media='(min-width:735px)'></source>
            <img width="100%" height="100%" />
         </picture>

      </div>
   )
}
