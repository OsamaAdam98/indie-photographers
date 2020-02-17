import React, {Suspense} from "react";

const withSuspense: React.FC<any> | null = (Child: any) => (
	<Suspense fallback={<div />}>
		<Child />
	</Suspense>
);

export default withSuspense;
