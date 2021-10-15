export declare class EventCommand {
	isGroupMsg?: boolean;
	isGroupAdmins?: boolean;
	isOwner?: boolean;
	enable?: boolean;
	isBot?: boolean;
}

export declare class EventsEmit implements EventCommand {
	className: string;
	callback: any;
	isGroupMsg?: boolean;
	isGroupAdmins?: boolean;
	isOwner?: boolean;
	enable?: boolean;
	isBot?: boolean;
}