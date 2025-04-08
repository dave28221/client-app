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
					d="M3 21v-9H1V9l11-7 11 7v3h-2v9h-4v-6h-2v6h-4v-6H9v6H3zm2-2h2v-4h4v4h2v-4h4v4h2v-7h2v-1.2L12 4 3 10.8V12h2v7z"
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
					d="M3 4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H3zm0 2h18v2H3V6zm0 4h8v8H3v-8zm10 0h8v8h-8v-8z"
				/>
			</svg>
		</span>
		<span>Websites</span>
	</a>

	<a href="/upload" class="homeCount">
		<span class="iconWrapper websitesIcon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1.4em"
				height="1.4em"
				viewBox="0 0 24 24"
			>
				<path
					fill="black"
					d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4v-6h3l-5-5z"
				/>
			</svg>
		</span>
		<span>Upload CSV</span>
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
		width: 340px;
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
