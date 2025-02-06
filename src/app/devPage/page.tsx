import GravitySection from '@/components/objects/gravity/section'
import Person from '@/components/person/person'
import React from 'react'

const Page = () => {
	return (
		<div className='w-screen h-screen flex items-center justify-center'>
			<div className='w-2/3 h-[80vh] bg-gray-200'>
				<GravitySection>
					<Person />
				</GravitySection>
			</div>
		</div>
	)
}

export default Page
