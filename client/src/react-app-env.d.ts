/// <reference types="react-scripts" />
declare module "*.jpg" {
	const value: any;
	export = value;
}

declare module "react-facebook-login/dist/facebook-login-render-props";

interface User {
	admin: boolean;
	email: string;
	profilePicture?: string;
	registerDate?: Date;
	username: string;
	__v?: number;
	_id: string;
}

interface SubUser {
	email: string;
	password: string;
}

interface customTheme {
	darkTheme?: object;
	lightTheme?: object;
}

interface Post {
	comments: [];
	date: Date;
	likes: Likes[];
	msg: string | null;
	photo: Photo;
	user: User;
	__v?: number;
	_id: string;
}

interface SubPost {
	username: string;
	email: string;
	msg?: string;
	realPhoto?: FormData | null;
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
	eager?: [
		{
			transformation?: string;
			width?: number;
			height?: number;
			bytes?: number;
			url?: string;
			secure_url?: string;
		}
	];
	secure_url?: string;
	signature?: string;
	original_filename?: string;
}

interface MatchParams {
	id: string;
}

type Severity = "success" | "info" | "warning" | "error" | undefined;
