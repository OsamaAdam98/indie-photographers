/// <reference types="react-scripts" />
declare module "*.jpg" {
	const value: any;
	export = value;
}

interface User {
	admin: boolean;
	email?: string;
	profilePicture?: string;
	registerDate?: Date;
	username?: string;
	__v?: number;
	_id?: string;
}

interface Theme {
	darkTheme?: object;
	lightTheme?: object;
}

interface Post {
	comments: [];
	date: Date;
	likes: Likes[];
	msg: string | null;
	photo: string | null;
	user: User;
	__v?: number;
	_id: string;
}

interface Likes {
	_id?: string;
	__v?: number;
	customID?: string;
	date?: Date;
	user: User;
	post?: string;
}

interface Photo {
	public_id?: string;
	version?: string;
	width?: number;
	height?: number;
	format?: string;
	created_at?: Date;
	resource_type?: string;
	tags?: [];
	bytes?: number;
	type?: string;
	etag?: string;
	url?: string;
	secure_url: string;
	signature?: string;
	original_filename?: string;
}
