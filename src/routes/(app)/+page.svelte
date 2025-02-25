<script>
</script>

<div class="homeBanner">
	<h1 class="leftAlign">Client Directory</h1>
	<div class="searchAndAdd"></div>
</div>


<div class="homeFlex">
	<a href="/lawfirms" class="homeCount">
		<span class="iconWrapper">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1.4em"
				height="1.4em"
				viewBox="0 0 24 24"
			>
				<path
					fill="black"
					d="M12.75 2.75V4.5h1.975c.351 0 .694.106.984.303l1.697 1.154q.063.042.14.043h4.102a.75.75 0 0 1 0 1.5H20.07l3.366 7.68a.75.75 0 0 1-.23.896q-.15.111-.31.206a6 6 0 0 1-.79.399a7.35 7.35 0 0 1-2.856.569a7.3 7.3 0 0 1-2.855-.568a6 6 0 0 1-.79-.4a3 3 0 0 1-.307-.202l-.005-.004a.75.75 0 0 1-.23-.896l3.368-7.68h-.886c-.351 0-.694-.106-.984-.303l-1.697-1.154a.25.25 0 0 0-.14-.043H12.75v14.5h4.487a.75.75 0 0 1 0 1.5H6.763a.75.75 0 0 1 0-1.5h4.487V6H9.275a.25.25 0 0 0-.14.043L7.439 7.197c-.29.197-.633.303-.984.303h-.886l3.368 7.68a.75.75 0 0 1-.209.878c-.08.065-.16.126-.31.223a6 6 0 0 1-.792.433a6.9 6.9 0 0 1-2.876.62a6.9 6.9 0 0 1-2.876-.62a6 6 0 0 1-.792-.433a4 4 0 0 1-.309-.221a.76.76 0 0 1-.21-.88L3.93 7.5H2.353a.75.75 0 0 1 0-1.5h4.102q.076 0 .141-.043l1.695-1.154c.29-.198.634-.303.985-.303h1.974V2.75a.75.75 0 0 1 1.5 0M2.193 15.198a5.4 5.4 0 0 0 2.557.635a5.4 5.4 0 0 0 2.557-.635L4.75 9.368Zm14.51-.024q.123.06.275.126c.53.223 1.305.45 2.272.45a5.85 5.85 0 0 0 2.547-.576L19.25 9.367Z"
				/>
			</svg>
		</span>
		<span>Law Firms</span>
	</a>

	<a href="/lawyers" class="homeCount">
		<span class="iconWrapper">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1.5em"
				height="1.4em"
				viewBox="0 0 24 22"
			>
				<path
					fill="black"
					d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"
				/>
			</svg>
		</span>
		<span>Lawyers</span>
	</a>

	<a href="/websites" class="homeCount">
		<span class="iconWrapper websitesIcon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1.4em"
				height="1.4em"
				viewBox="0 0 24 24"
			>
				<path
					fill="black"
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14C8.69 6 6 8.69 6 12s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
				/>
			</svg>
		</span>
		<span>Websites</span>
	</a>
</div>

<style>
	.homeBanner {
		display: flex;
		justify-content: space-between;
		background-color: rgb(97, 97, 255);
		color: white;
	}
	a.homeCount {
		display: block;
		text-decoration: none;
		color: inherit;
		font-size: 20px;
		font-weight: 400;
	}

	.iconWrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 10px; /* Space between the icon and text */
	}

	.websitesIcon svg {
		margin: 0; /* Remove extra space around the website icon */
	}

	.homeFlex {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: center;
		gap: 5px;
		padding: 55px;
		padding-top: 30px;
		background-color: #ffffff;
	}

	.leftAlign {
		padding: 30px;
	}

	.homeCount {
		text-align: center;
		width: 400px;
		padding: 50px;
		border: 1px solid rgb(222, 218, 218);
		margin: 20px;
		height: 205px;
		background-color: rgb(255, 255, 255);
		border-radius: 10px;
		box-shadow: 0px 4px 8px rgba(44, 54, 55, 0.3);
	}

	.homeCount:hover {
		background-color: rgb(97, 97, 255);
	}
</style>
